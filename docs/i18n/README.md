# ValveChain Documentation Internationalization

This directory contains localized versions of ValveChain documentation to improve global accessibility and ensure technical accuracy across different languages and regions.

## Available Languages

- **English** (en) - Default language, located in `/docs/`
- **中文** (zh) - Chinese translations for Asian markets
- **Español** (es) - Spanish translations for Latin American and European markets  
- **Deutsch** (de) - German translations for European industrial markets

## Documentation Structure

```
docs/
├── i18n/
│   ├── zh/          # Chinese (Simplified)
│   │   ├── README.md
│   │   ├── onboarding-guide.md
│   │   └── color-scheme.md
│   ├── es/          # Spanish
│   │   ├── README.md
│   │   ├── onboarding-guide.md
│   │   └── color-scheme.md
│   ├── de/          # German
│   │   ├── README.md
│   │   ├── onboarding-guide.md
│   │   └── color-scheme.md
│   └── README.md    # This file
└── [original English docs]
```

## Translation Guidelines

### For Contributors

1. **Accuracy First**: Ensure technical terms are accurately translated, especially valve industry terminology
2. **Cultural Context**: Adapt examples and references to local industrial practices where appropriate
3. **Consistency**: Use consistent terminology throughout all documentation
4. **Format Preservation**: Maintain original markdown formatting, links, and code examples
5. **Regular Updates**: Keep translations synchronized with English version updates

### Technical Terms Dictionary

Key terms that require consistent translation:

| English | 中文 | Español | Deutsch |
|---------|------|---------|---------|
| Valve | 阀门 | Válvula | Ventil |
| Purchase Order | 采购订单 | Orden de Compra | Bestellung |
| Manufacturer | 制造商 | Fabricante | Hersteller |
| Supply Chain | 供应链 | Cadena de Suministro | Lieferkette |
| Blockchain | 区块链 | Cadena de Bloques | Blockchain |
| Tokenization | 代币化 | Tokenización | Tokenisierung |

### Quality Standards

- **Native Speaker Review**: All translations should be reviewed by native speakers with technical background
- **Industry Expertise**: Reviewers should have knowledge of industrial valve systems
- **Regular Audits**: Translations reviewed quarterly for accuracy and relevance
- **User Feedback**: Mechanism for users to report translation issues

## How to Contribute Translations

### New Language Support

1. Create a new language directory: `docs/i18n/[language-code]/`
2. Copy English documentation files to the new directory
3. Translate content while preserving structure and formatting
4. Submit pull request with translation
5. Ensure native speaker review before merging

### Updating Existing Translations

1. Check English documentation for recent changes
2. Update corresponding translated files
3. Maintain consistency with established terminology
4. Submit pull request with updates

### Translation Workflow

1. **Assignment**: Claim translation work via GitHub issues
2. **Translation**: Complete translation following guidelines
3. **Self-Review**: Check formatting, links, and terminology
4. **Peer Review**: Get review from another native speaker
5. **Technical Review**: Ensure technical accuracy
6. **Submit**: Create pull request with detailed description

## Native Speaker Requirements

For each target language, we recommend hiring or contracting:

### Chinese (Simplified) - 中文
- **Background**: Technical writer with industrial automation experience
- **Location**: China, Taiwan, or Chinese-speaking regions
- **Expertise**: Manufacturing, supply chain, blockchain technology
- **Certifications**: Technical writing certification preferred

### Spanish - Español  
- **Background**: Technical writer with industrial engineering experience
- **Location**: Spain, Mexico, Argentina, or Spanish-speaking regions
- **Expertise**: Industrial valve systems, manufacturing processes
- **Certifications**: Technical translation certification preferred

### German - Deutsch
- **Background**: Technical writer with mechanical engineering background
- **Location**: Germany, Austria, Switzerland
- **Expertise**: Industrial automation, precision manufacturing
- **Certifications**: Technical communication certification preferred

## Maintenance and Updates

### Regular Review Schedule
- **Monthly**: Check for English documentation updates
- **Quarterly**: Full review of all translations for accuracy
- **Annually**: Complete audit and terminology updates

### Version Control
- Each translation tracks the English version it's based on
- Update headers include English version hash or date
- Change logs maintained for major updates

### Quality Metrics
- User feedback scores by language
- Translation accuracy assessments
- Usage analytics by language preference

## Support and Resources

### Translation Tools
- **CAT Tools**: Translation memory systems for consistency
- **Terminology Management**: Centralized glossary maintenance
- **Quality Assurance**: Automated checks for formatting and links

### Community Support
- Translation contributor forum
- Monthly virtual meetups for translators
- Best practices sharing and training

### Technical Support
- GitHub issue templates for translation-specific issues
- Documentation maintainer contact information
- Emergency contact for critical translation errors

## Getting Started

1. **Select Language**: Choose your target language
2. **Review Guidelines**: Read this document thoroughly
3. **Check Issues**: Look for open translation requests
4. **Join Community**: Introduce yourself in discussions
5. **Start Small**: Begin with a single document
6. **Get Feedback**: Submit for review and iterate

For questions about translation contributions, please create an issue with the `translation` label or contact our documentation team.