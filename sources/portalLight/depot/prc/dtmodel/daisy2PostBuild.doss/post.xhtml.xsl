<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" exclude-result-prefixes="xhtml">
	<xsl:param name="cleanNccMeta"/>
	<xsl:param name="clean4VoiceDream"/>
	<!-- changement de processor xslt pour ajout du doctype -->
	<xsl:output method="xml" version="1.0" encoding="UTF-8" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN" doctype-system="xhtml1-transitional.dtd" indent="no"/>

	<xsl:template match="xhtml:meta"><xsl:choose>
			<xsl:when test="$cleanNccMeta = 'true' and starts-with(@name, 'ncc')"/>
			<xsl:otherwise>
				<xsl:copy><xsl:apply-templates select="@*|node()"/></xsl:copy>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- Supression des alt audio du résultat -->
	<xsl:template match="xhtml:cmd|@cmd"/>

	<!-- reformatage du contenu pour validité VoiceDream #13101 -->
	<!-- Supp des divs -->
	<xsl:template match="xhtml:div[$clean4VoiceDream = 'true']">
		<xsl:apply-templates select="node()"/>
	</xsl:template>

	<xsl:template match="xhtml:p[$clean4VoiceDream = 'true'][ancestor::xhtml:div[@id='dnotes']][position()=1]/@id">
			<xsl:attribute name="id"><xsl:value-of select="ancestor::xhtml:div[1]/@id"/></xsl:attribute>
	</xsl:template>

	<!-- Supp des spans et des inline dans les titres -->
	<xsl:template match="xhtml:h1|xhtml:h2|xhtml:h3|xhtml:h4|xhtml:h5|xhtml:h6">
		<xsl:copy>
			<xsl:apply-templates select="@*[local-name() != 'id']"/>
			<xsl:choose>
				<xsl:when test="$clean4VoiceDream = 'true'">
					<xsl:apply-templates select="@*[local-name() != 'id']"/>
					<xsl:attribute name="id"><xsl:value-of select="xhtml:span/@id"/></xsl:attribute>
				</xsl:when>
				<xsl:otherwise><xsl:apply-templates select="@*"/></xsl:otherwise>
			</xsl:choose>
			<xsl:choose>
				<xsl:when test="$clean4VoiceDream = 'true'"><xsl:apply-templates select="descendant::text()"/></xsl:when>
				<xsl:otherwise><xsl:apply-templates /></xsl:otherwise>
			</xsl:choose>
		</xsl:copy>
	</xsl:template>


	<xsl:template match="@*|node()">
		<xsl:copy><xsl:apply-templates select="@*|node()"/></xsl:copy>
	</xsl:template>

	<!-- Suppression des inlines sans texte dans les paragraphes -->
	<xsl:template match="xhtml:p">
		<xsl:copy><xsl:apply-templates select="@*[not(local-name()='refid')]|node()" mode="removeEmpty"/></xsl:copy>
	</xsl:template>
	<xsl:template match="@*" mode="removeEmpty">
		<xsl:copy><xsl:apply-templates select="@*|node()"/></xsl:copy>
	</xsl:template>
	<!-- Supression des alt audio du résultat -->
	<xsl:template match="xhtml:cmd|@cmd" mode="removeEmpty"/>

	<xsl:template match="node()" mode="removeEmpty">
		<xsl:if test="descendant-or-self::text()">
			<xsl:copy><xsl:apply-templates select="@*|node()" mode="removeEmpty"/></xsl:copy>
		</xsl:if>
	</xsl:template>

	<!-- Note en fin de document (liens dans les paragraphes) :
		reconstruction de la liaison avec le nouvel identifiant -->
	<xsl:template match="@href[starts-with(.,'#')]" mode="removeEmpty">
		<xsl:variable name="searchRef" select="substring-after(., '#')" />
		<xsl:choose>
			<xsl:when test="(//node()[@refid=$searchRef])[1]/@id">
				<!-- remplacer la liaison par le nouvel identifiant du noeud -->
				<xsl:attribute name="href"><xsl:value-of select="concat('#',(//node()[@refid=$searchRef])[1]/@id)"/></xsl:attribute>
			</xsl:when>
			<xsl:otherwise>
				<xsl:copy><xsl:apply-templates select="@*|node()" mode="removeEmpty"/></xsl:copy>
			</xsl:otherwise>
		</xsl:choose>

	</xsl:template>

</xsl:stylesheet>