package eu.scenari.editadapt.ant;

import java.io.*;
import java.util.*;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Task;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.ext.Attributes2Impl;
import org.xml.sax.helpers.AttributesImpl;
import org.xml.sax.helpers.DefaultHandler;

import eu.scenari.commons.log.LogMgr;
import eu.scenari.commons.log.LogMsg;
import eu.scenari.commons.log.TraceMgr;
import eu.scenari.commons.log.TracePoint;
import eu.scenari.xml.serializer.xerces.impl.XMLSerializer;


/**
 * Task ant qui vient rebaliser un contenu XML sur la base d'un jeu de phrase donné par Acapela.
 */
public class SplitSentencesBySpanTask extends Task {
	public static final TracePoint sTrace = TraceMgr.register(SplitSentencesBySpanTask.class.getName() + ".sTrace", "Traces SplitSentencesBySpanTask.");
	protected static final String sBreakStr = "\\break\\";
	protected File inFile;
	protected File outFile;
	protected String sentencesSfx;

	protected String parser = null;

	public void setOutFile(File outFile) {
		this.outFile = outFile;
	}

	public void setInFile(File inFile) {
		this.inFile = inFile;
	}

	public void setSentencesSfx(String pSentencesSfx) {
		sentencesSfx = pSentencesSfx;
	}

	public void setParser(String pParser) {
		parser = pParser;
	}

	protected BufferedReader openSentences(String id) throws FileNotFoundException {
		File file = inFile.getParentFile().toPath().resolve(id + sentencesSfx).toFile();
		if (!file.exists()) return null;
		if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] Open new sentence file: %s", file.getAbsolutePath());
		FileReader fileReader = new FileReader(file);
		return new BufferedReader(fileReader);
	}

	@Override
	public void execute() throws BuildException {
		// Pour debugging
		// TraceMgr.enableTrace(SplitSentencesBySpanTask.class.getName() + ".sTrace", true);
		try (FileWriter writer = new FileWriter(outFile);
				 FileReader reader = new FileReader(inFile)) {
			if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] START: transform %s to %s", inFile.getAbsolutePath(), outFile.toString());
			XMLSerializer xml = new XMLSerializer(writer, XMLSerializer.XML_OUTPUT);
			SAXParser parser = SAXParserFactory.newInstance().newSAXParser();
			DefaultHandler handler = null;
			if (this.parser != null && this.parser.equals("daisy3")) handler = new SplitSentencesBySpanDaisy3SaxHandler(xml);
			else if (this.parser != null && this.parser.equals("epub3")) handler = new SplitSentencesBySpanEpub3SaxHandler(xml);
				//Daisy 2 -> Default mode
			else handler = new SplitSentencesBySpanDaisy2SaxHandler(xml);
			parser.parse(inFile, handler);
		} catch (BuildException e) {
			throw e;
		} catch (Exception e) {
			throw LogMgr.addMessage(new BuildException(e, getLocation()), LogMgr.getMessage(e));
		}
	}

	protected class SplitSentencesBySpanDaisy2SaxHandler extends DefaultHandler {

		protected LinkedList<Map<String, Object>> elmntStack = new LinkedList<>();

		/**
		 * Flag qui détermine quand le parser est dans une balise de contenu textuel (hx, p) ou en dehors.
		 * Le traitement des caractères est alors différencié (copie avec controle de phrase et injection de span versus copie simple)
		 */
		protected boolean inFlow = false;

		protected XMLSerializer xml;

		protected String uri;
		protected String sentence = null;
		protected int sentenceOffset = 0;
		protected boolean inSentence = false;
		/**
		 * altAudio permet de définir des prononciations alternatives dans le modèle.
		 * Le flux texte XHML diffère alors de l'envoi à Acapela, on copie le texte sans chercher à le faire matcher avec les phrases Acapela.
		 */
		protected boolean inAltAudio = false;
		/**
		 * Tentative de copy en ignorant les caractères non signifiants (non alpha num) différents entre Acapela et la source.
		 */
		protected boolean fuzzyMode = false;
		/**
		 * Flag de gestion du statut de la stack (ouverte ou fermée)
		 */
		protected boolean stackClosed = false;
		BufferedReader sentencesReader = null;

		SplitSentencesBySpanDaisy2SaxHandler(XMLSerializer xml) {
			this.xml = xml;
		}

		@Override
		public void startDocument() throws SAXException {
			if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] Start document - ", outFile.getAbsolutePath());
			xml.startDocument();
		}

		protected String getAcapelaFileName(String uri, String localName, String qName, Attributes attributes) {
			if (qName.equals("div")) {
				String id = attributes.getValue("id");
				String className = attributes.getValue("class");
				if (id != null && !className.equals("note")) {
					return id;
				}
			}
			return null;
		}

		protected boolean isInFlow(String uri, String localName, String qName) {
			if ((qName.startsWith("h") && qName.length() == 2)
					|| qName.equals("p")
					|| qName.equals("aside")) return true;
			return false;
		}


		// Control de la stack

		/**
		 * Ouverture des balises présentes dans la stack
		 *
		 * @throws SAXException
		 */
		private void openStackElements() throws SAXException {
			if (stackClosed && !elmntStack.isEmpty()) {
				if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] open all elements of the stack");
				for (Map<String, Object> element : elmntStack) {
					if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] open stacked %s", element.get("qName"));
					AttributesImpl attributes = new AttributesImpl();
					Map<String, String> elementAtts = (Map<String, String>) element.get("attributes");
					for (String key : elementAtts.keySet()) {
						attributes.addAttribute(null, "", key, "string", elementAtts.get(key));
					}
					if (((String) element.get("localName")).equals("span") && attributes.getValue("class") != null && attributes.getValue("class").equals("altaudio")) {
						if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] span@class='altaudio' - enter inAltAudio mode");
						this.inAltAudio = true;
					}
					xml.startElement((String) element.get("uri"), (String) element.get("localName"), (String) element.get("qName"), attributes);
				}
				stackClosed = false;
			}
		}

		/**
		 * Fermeture des balises présentes dans la stack
		 *
		 * @throws SAXException
		 */
		private void closeStackElements() throws SAXException {
			if (!elmntStack.isEmpty()) {
				if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] close stacked elements");
				for (Iterator<Map<String, Object>> it = elmntStack.descendingIterator(); it.hasNext(); ) {
					Map<String, Object> element = it.next();

					if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] close stacked %s", element.get("qName"));
					xml.endElement((String) element.get("uri"), (String) element.get("localName"), (String) element.get("qName"));
					//System.out.println("End stack " + (String) element.get("qName"));
					if (!stackClosed) stackClosed = true;
				}
			}
		}

		/**
		 * Ouverture d'une balise de phrase
		 *
		 * @throws SAXException
		 */
		private void openSentence() throws SAXException {
			//ouverture du span
			Attributes2Impl attr = new Attributes2Impl();
			attr.addAttribute(null, null, "class", null, "sentence");
			xml.startElement(uri, "span", "span", attr);
			inSentence = true;
		}

		/**
		 * Fermeture d'une balise de phrase
		 *
		 * @throws SAXException
		 */
		private void closeSentence() throws SAXException {
			//fermeture du span
			xml.endElement(uri, "span", "span");
			inSentence = false;
		}


		@Override
		public void startElement(String uri, String localName, String qName, Attributes attributes) throws SAXException {
			if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] Start element %s", qName);
			String acapelaFileName = getAcapelaFileName(uri, localName, qName, attributes);
			if (acapelaFileName != null) {
				if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] new Acapela File found on div - load new sentence file %s", acapelaFileName);
				closeSentencesReader();
				openSentencesReader(acapelaFileName);
				if (sentencesReader != null) nextSentence();
			}

			if (isInFlow(uri, localName, qName)) { // on entre dans un block de contenu
				if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] enter 'inFlow' mode");
				inFlow = true;
				xml.startElement(uri, localName, qName, attributes);
				//Mémorisation de l'uri pour fermer les spans
				this.uri = uri;
				stackClosed = true;
			} else {
				if (inFlow) { // on est dans un block de contenu
					if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] 'inFlow' is ON - element %s added to stack", qName);
					Map<String, Object> element = new HashMap<>(4);
					element.put("uri", uri);
					element.put("localName", localName);
					element.put("qName", qName);
					Map<String, String> elementAtts = new HashMap<>(attributes.getLength());
					for (int i = 0; i < attributes.getLength(); i++) {
						elementAtts.put(attributes.getQName(i), attributes.getValue(i));
					}
					element.put("attributes", elementAtts);

					elmntStack.add(element);
					if (qName.equals("span") && attributes.getValue("class") != null && attributes.getValue("class").equals("altaudio")) {
						if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] span@class='altaudio' - enter inAltAudio mode");
						this.inAltAudio = true;
					}
				}
				xml.startElement(uri, localName, qName, attributes);

			}
		}

		private String lastContentCopied = "";

		@Override
		public void characters(char[] ch, int start, int length) throws SAXException {
			try {
				String content = new String(ch, start, length);
				lastContentCopied = content;
				if (inFlow) {
					for (int i = start; i < start + length; i++) {
						if (sentence == null) {
							LogMgr.publishMessage(new LogMsg("[" + this.getClass().getName() + "] Xml txt `%s` at char %d [%c]. No more acapela string to process (sentence=null)", new String(ch, start, length), i, ch[i]));
							throw LogMgr.newException("[" + this.getClass().getName() + "] Xml txt (%s) at char %d [%c]. No more acapela string to process (sentence=null)", new String(ch, start, length), i, ch[i]);
						}
						if (inAltAudio) {
							if (!inSentence) { // Cas d'un alt audio en début de phrase
								if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] character found - not inSentence - start new span@class='sentence'");

								// fermeture des éléments précédents la phrase
								closeStackElements();
								//ouverture du span de phrase
								openSentence();
								//ré-ouverture des éléments de la stack dans le span de phrase
								openStackElements();
							}
							if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] characters inFlow and in altAudioMode - copy");
							xml.characters(ch, i, 1);
						} else if (sentenceOffset >= sentence.length()) { // cas d'erreur rencontré précédement, est normalement corrigé
							throw new IndexOutOfBoundsException(
									String.format(
											"fin de phrase dépassé, potentielle probleme d'alt audio : char = %c | txt = %s | acapella = %s",
											ch[i],
											new String(ch, start, length),
											sentence.toString())
							);
						} else if (sentence.charAt(sentenceOffset) == ch[i]) {
							if (!inSentence) {
								if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] character found - not inSentence - start new span@class='sentence'");
								// fermeture des éléments précédents la phrase
								closeStackElements();
								//ouverture du span
								openSentence();
								//réouverture de la stack dans la phrase
								openStackElements();
							}
							xml.characters(ch, i, 1);
							sentenceOffset++;
							fuzzyMode = false;
						} else if (!inSentence) { // Cas où des éléments / caractères ne sont pas renvoyé par acapela car transformé en silence
							// Difference entre le début de la phrase de l'audio et le texte du html
							// Test des correspondances spéciales pour le texte converti en commande par acapela
							if (content.trim().matches("\\*(\\s*\\*(\\s*\\*)?)?") &&
									Objects.equals(sentence, "\\break\\")
							) {
								// - Présence de séparateur de paragraphes : * ou *** ou * * *
								// Ces séparateurs sont convertis en \break\ par acapela
								// Copier tout et passer a la suite
								xml.characters(ch, i, length);
								i += length;
								nextSentence();
							} else {
								xml.characters(ch, i, 1);
								if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] char '%s' not equals out of sentence - copy", ch[i]);
							}
						} else if (sentence.charAt(sentenceOffset) == '\\') {
							sentenceOffset++;
							sentenceOffset += sentence.substring(sentenceOffset).indexOf('\\') + 1;
							i--;
							if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] escaping char \\ - ignore");
						} else if (!Character.isLetterOrDigit(ch[i])) {
							//On tente une copie... contexte groupe de char de ponctuation non prononcé
							xml.characters(ch, i, 1);
							fuzzyMode = true;
							if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] char not equals non digit or number char - copy end enter fuzzy mode");
						} else {
							LogMgr.publishMessage(new LogMsg("[" + this.getClass().getName() + "] - Xml txt `%s` at char %d [%c] does not match Acapela sentence `%s` at char %d [%c]", new String(ch, start, length), i, ch[i], sentence, sentenceOffset, sentence.charAt(sentenceOffset)));
							throw LogMgr.newException("[" + this.getClass().getName() + "] - Xml txt `%s` at char %d [%c] does not match Acapela sentence `%s` at char %d [%c]", new String(ch, start, length), i, ch[i], sentence, sentenceOffset, sentence.charAt(sentenceOffset));
						}
						if (sentenceOffset == sentence.length()) { // on a atteint la fin de la phrase
							//Fermeture de la stack
							closeStackElements();
							if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] last char of sentence - close span@class='sentence'");
							//fermeture du span de la phrase
							closeSentence();
							//Changement de phrase
							nextSentence();
							// Réouverture de la stack
							openStackElements();
						}
					}
				} else {
					xml.characters(ch, start, length);
				}
			} catch (Exception e) {
				LogMgr.publishMessage(
						new LogMsg("[" + this.getClass().getName() + "] Erreur sur Xml txt `%s`, Acapela sentence `%s` : `%s` ", new String(ch, start, length), sentence.toString(), e.getMessage()));
				throw e;
			}

		}

		@Override
		public void endElement(String uri, String localName, String qName) throws SAXException {
			if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] End element %s", qName);

			boolean isSentenceEnd = false;
			if (isInFlow(uri, localName, qName)) { // Fermeture d'un block de contenu
				if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] element p or hx, quit 'inFlow' mode");
				// Par securité, fermer la stack s'il reste des éléments ouverts
				closeStackElements();
				//S'il ne reste qu'un séparateur "/break/" dans la phrase ou qu'on est en mode "fuzzy", on referme la phrase
				if (sentence != null && sentence.substring(sentenceOffset).equals(sBreakStr) || fuzzyMode) {
					if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] sentence not null but in fuzzy mode or equals break - close span@class='sentence'");
					closeSentence();
					//System.out.println("End span sentence (end El) ");
					if (!fuzzyMode) nextSentence();
				} else if (sentence != null && sentenceOffset != 0) { // demande de fermeture de block alors que la phrase n'est pas fini
					// Cas d'erreur de reconstruction de balisage, normalement corriger par les fermetures et ouvertures systematique de stack autour des phrases
					LogMgr.publishMessage(new LogMsg("Xml structure need to close tag %s and Acapala sentence is not ended : end of sentence is %s and sentence is %s", qName, sentence.substring(sentenceOffset), sentence));
					throw LogMgr.newException("Xml structure need to close tag %s and Acapala sentence is not ended : end of sentence is %s and sentence is %s", qName, sentence.substring(sentenceOffset), sentence);
				}
				inFlow = false;
				assert (elmntStack.isEmpty());
			} else if (inFlow) { // fermeture d'une balises d'enrichissement / inlined
				if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] Poll last element from stack");
				Map<String, Object> element = elmntStack.pollLast();
				//Si fermeture du dernier élément de la stack, on considère la stack fermée
				if (elmntStack.isEmpty()) stackClosed = false;
				HashMap<String, String> elementAttributes = (HashMap<String, String>) (element != null ? element.get("attributes") : null);
				if (qName.equals("span")
						&& elementAttributes != null
						&& elementAttributes.get("class") != null
						&& elementAttributes.get("class").equals("altaudio")
				) { // fermeture d'un alt audio
					inAltAudio = false;
					if (elementAttributes.get("cmd") != null) {
						sentenceOffset += elementAttributes.get("cmd").length();
					}
					// Si on a atteint la fin de la phrase, on la ferme aussi
					// et on prépare la phrase suivante
					if (sentenceOffset >= sentence.length()) {
						isSentenceEnd = true;
						nextSentence();
					}
				}
			}
			try {
				xml.endElement(uri, localName, qName);
				if (isSentenceEnd) {
					// fermer la stack restante,
					closeStackElements();
					// fermer la phrase précédente
					closeSentence();
					// réouvrir la stack restante
					openStackElements();
				}
			} catch (Exception e) {
				// pour debug : sauvegarde du résultats
				LogMgr.publishMessage(new LogMsg("Un erreur est survenue en fermant l'élément %s \r\n-fin de phrase acapela : %s\r\n-phrase acapela en cours: %s\r\n-dernier contenu copier : %s", qName, sentence.substring(sentenceOffset), sentence, lastContentCopied));
				throw new SAXException("Une erreur est survenu en fermant l'élément " + qName, e);
			}

			//System.out.println("End " + qName);
		}

		@Override
		public void endDocument() throws SAXException {
			if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] End document - ", outFile.getAbsolutePath());
			closeSentencesReader();
			xml.endDocument();
		}

		protected void nextSentence() {
			try {
				sentence = sentencesReader.readLine();
				if (sTrace.isEnabled()) LogMgr.publishTrace("[" + this.getClass().getName() + "] Load new sentence:\n%s", sentence);
				sentenceOffset = 0;
			} catch (Exception e) {
				LogMgr.publishException(e);
				sentence = null;
				closeSentencesReader();
			}
		}

		protected void closeSentencesReader() {
			if (sentencesReader != null) {
				try {
					sentencesReader.close();
				} catch (IOException e) {
					LogMgr.publishException(e);
				} finally {
					sentencesReader = null;
				}
			}
		}

		protected void openSentencesReader(String id) {
			try {
				sentencesReader = openSentences(id);
			} catch (FileNotFoundException e) {
				LogMgr.publishException(e);
				closeSentencesReader();
			}
		}
	}

	protected class SplitSentencesBySpanEpub3SaxHandler extends SplitSentencesBySpanDaisy2SaxHandler {

		SplitSentencesBySpanEpub3SaxHandler(XMLSerializer xml) {
			super(xml);
		}

		@Override
		protected String getAcapelaFileName(String uri, String localName, String qName, Attributes attributes) {
			if (qName.equals("section")) {
				String id = attributes.getValue("id");
				if (id != null) return id;
			}
			return null;
		}
	}

	protected class SplitSentencesBySpanDaisy3SaxHandler extends SplitSentencesBySpanDaisy2SaxHandler {

		SplitSentencesBySpanDaisy3SaxHandler(XMLSerializer xml) {
			super(xml);
		}

		@Override
		protected String getAcapelaFileName(String uri, String localName, String qName, Attributes attributes) {
			if (qName.startsWith("level") || qName.equals("frontmatter")) {
				String id = attributes.getValue("id");
				String className = attributes.getValue("class");
				if (id != null && (className == null || !className.equals("note"))) {
					return id;
				}
			}
			return null;
		}

		@Override
		protected boolean isInFlow(String uri, String localName, String qName) {
			if ((qName.startsWith("h") && qName.length() == 2)
					|| qName.equals("p")
					|| qName.equals("line")
					|| qName.equals("doctitle")
					|| qName.equals("docauthor")
					|| qName.equals("covertitle")
					|| qName.equals("bridgehead")
			) {
				return true;
			}
			return false;
		}
	}
}
