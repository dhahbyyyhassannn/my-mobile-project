const xml2js = require('xml2js');
const logger = require('../utils/logger');

class ODataParser {
  constructor() {
    this.parser = new xml2js.Parser({
      explicitArray: false,
      mergeAttrs: true,
      tagNameProcessors: [xml2js.processors.stripPrefix]
    });
  }

  async parseXMLToJSON(xmlData) {
    try {
      const result = await this.parser.parseStringPromise(xmlData);
      return this.extractEntries(result);
    } catch (error) {
      logger.error('Erreur parsing XML:', error);
      throw new Error('Échec du parsing XML vers JSON');
    }
  }

  extractEntries(parsedData) {
    // Navigation dans la structure OData typique
    const feed = parsedData.feed || parsedData;
    const entries = feed.entry || [];
    
    return Array.isArray(entries) ? entries : [entries];
  }

  normalizeImmobilisation(odataEntry) {
    // Support pour JSON direct (pas de parsing XML nécessaire)
    if (typeof odataEntry === 'object' && !odataEntry.content) {
      return {
        code: odataEntry.No || odataEntry.code || '',
        designation: odataEntry.Description || odataEntry.designation || '',
        numeroFournisseur: odataEntry.No_fournisseur || '',
        numeroSociete: odataEntry.No_societe_maintenance || '',
        responsable: odataEntry.Responsable || '',
        designationRecherche: odataEntry.Designation_de_recherche || '',
        groupeCompta: odataEntry.Groupe_compta || '',
        dateDebutAmortisse: odataEntry.Date_debut_amortisse || '',
        nombreAnneesAmortisse: parseInt(odataEntry.Nombre_annees_amortissement) || 0,
        codeAjax: odataEntry.Code_Ajix || '',
        numeroSerie: odataEntry.N_de_serie || '',
        codeEmplacement: odataEntry.Code_emplacement || ''
      };
    }

    // Support pour structure XML parsée
    const props = odataEntry.content?.properties || odataEntry.properties || {};
    
    return {
      code: props.No || props.code || '',
      designation: props.Description || props.designation || '',
      numeroFournisseur: props.No_fournisseur || '',
      numeroSociete: props.No_societe_maintenance || '',
      responsable: props.Responsable || '',
      designationRecherche: props.Designation_de_recherche || '',
      groupeCompta: props.Groupe_compta || '',
      dateDebutAmortisse: props.Date_debut_amortisse || '',
      nombreAnneesAmortisse: parseInt(props.Nombre_annees_amortissement) || 0,
      codeAjax: props.Code_Ajix || '',
      numeroSerie: props.N_de_serie || '',
      codeEmplacement: props.Code_emplacement || ''
    };
  }

  normalizeBureau(odataEntry) {
    // Support JSON direct
    if (typeof odataEntry === 'object' && !odataEntry.content) {
      return {
        code: odataEntry.Code || odataEntry.code || '',
        designation: odataEntry.Name || odataEntry.designation || '',
        responsable: odataEntry.Responsable || ''
      };
    }

    // Support XML parsé
    const props = odataEntry.content?.properties || odataEntry.properties || {};
    
    return {
      code: props.Code || props.code || '',
      designation: props.Name || props.designation || '',
      responsable: props.Responsable || ''
    };
  }

  normalizeArray(odataArray) {
    if (!Array.isArray(odataArray)) {
      return [];
    }
    return odataArray.map(entry => this.normalizeImmobilisation(entry));
  }
}

module.exports = new ODataParser();