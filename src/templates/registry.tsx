import type { ComponentType } from 'react'
import type { TemplateId } from '@/constants'
import { TEMPLATE_IDS } from '@/constants'
import type { TemplateConfig, TemplateProps } from './types'
import { toJadeResume } from './adapter'

import { AcademicTemplate } from './academic'
import { ArchitectTemplate } from './architect'
import { ArtisticTemplate } from './artistic'
import { AtsTemplate } from './ats'
import { BerlinTemplate } from './berlin'
import { BlocksTemplate } from './blocks'
import { BoldTemplate } from './bold'
import { CardTemplate } from './card'
import { ClassicTemplate } from './classic'
import { CleanTemplate } from './clean'
import { CoderTemplate } from './coder'
import { CompactTemplate } from './compact'
import { ConsultantTemplate } from './consultant'
import { CorporateTemplate } from './corporate'
import { CreativeTemplate } from './creative'
import { DesignerTemplate } from './designer'
import { DeveloperTemplate } from './developer'
import { ElegantTemplate } from './elegant'
import { EngineerTemplate } from './engineer'
import { EuroTemplate } from './euro'
import { ExecutiveTemplate } from './executive'
import { FinanceTemplate } from './finance'
import { FormalTemplate } from './formal'
import { GradientTemplate } from './gradient'
import { InfographicTemplate } from './infographic'
import { JapaneseTemplate } from './japanese'
import { LegalTemplate } from './legal'
import { LuxeTemplate } from './luxe'
import { MagazineTemplate } from './magazine'
import { MaterialTemplate } from './material'
import { MedicalTemplate } from './medical'
import { MetroTemplate } from './metro'
import { MinimalTemplate } from './minimal'
import { ModernTemplate } from './modern'
import { MosaicTemplate } from './mosaic'
import { NeonTemplate } from './neon'
import { NordicTemplate } from './nordic'
import { ProfessionalTemplate } from './professional'
import { RetroTemplate } from './retro'
import { RibbonTemplate } from './ribbon'
import { RoseTemplate } from './rose'
import { ScientistTemplate } from './scientist'
import { SidebarTemplate } from './sidebar'
import { StartupTemplate } from './startup'
import { SwissTemplate } from './swiss'
import { TeacherTemplate } from './teacher'
import { TimelineTemplate } from './timeline'
import { TwoColumnTemplate } from './two-column'
import { WatercolorTemplate } from './watercolor'
import { ZigzagTemplate } from './zigzag'

type JadeComponent = ComponentType<{ resume: ReturnType<typeof toJadeResume> }>

function wrap(JadeComponent: JadeComponent): ComponentType<TemplateProps> {
  return function TemplateWrapper({ resume }: TemplateProps) {
    return <JadeComponent resume={toJadeResume(resume)} />
  }
}

function meta(
  id: TemplateId,
  name: string,
  description: string,
  tags: string[],
  previewColor: string
): TemplateConfig['meta'] {
  return { id, name, description, tags, previewColor }
}

export const TEMPLATE_REGISTRY: Record<TemplateId, TemplateConfig> = {
  academic:     { meta: meta('academic',     'Academic',     'Scholarly layout for academic and research roles.',           ['Single-column', 'Academic', 'ATS'],         '#1e3a5f'), component: wrap(AcademicTemplate) },
  architect:    { meta: meta('architect',    'Architect',    'Structured layout for design and architecture.',              ['Two-column', 'Design', 'Creative'],          '#374151'), component: wrap(ArchitectTemplate) },
  artistic:     { meta: meta('artistic',     'Artistic',     'Bold creative layout for designers and artists.',             ['Two-column', 'Creative', 'Colorful'],        '#7c3aed'), component: wrap(ArtisticTemplate) },
  ats:          { meta: meta('ats',          'ATS Optimized','Maximum ATS compatibility, plain single-column.',             ['Single-column', 'ATS', 'Plain'],            '#374151'), component: wrap(AtsTemplate) },
  berlin:       { meta: meta('berlin',       'Berlin',       'Modern European minimalism.',                                 ['Single-column', 'Minimal', 'European'],      '#18181b'), component: wrap(BerlinTemplate) },
  blocks:       { meta: meta('blocks',       'Blocks',       'Grid block-based layout for visual impact.',                  ['Two-column', 'Creative', 'Grid'],            '#1d4ed8'), component: wrap(BlocksTemplate) },
  bold:         { meta: meta('bold',         'Bold',         'High-contrast bold typography for attention.',                ['Single-column', 'Bold', 'High-contrast'],    '#111827'), component: wrap(BoldTemplate) },
  card:         { meta: meta('card',         'Card',         'Card-based layout with distinct section boxes.',              ['Two-column', 'Card', 'Modern'],              '#0f766e'), component: wrap(CardTemplate) },
  classic:      { meta: meta('classic',      'Classic',      'Time-tested classic resume layout.',                          ['Single-column', 'Classic', 'ATS'],          '#374151'), component: wrap(ClassicTemplate) },
  clean:        { meta: meta('clean',        'Clean',        'Crisp and uncluttered single-column design.',                 ['Single-column', 'Clean', 'ATS'],            '#6b7280'), component: wrap(CleanTemplate) },
  coder:        { meta: meta('coder',        'Coder',        'Terminal-inspired layout for software engineers.',            ['Two-column', 'Tech', 'Developer'],           '#065f46'), component: wrap(CoderTemplate) },
  compact:      { meta: meta('compact',      'Compact',      'Information-dense single-page layout.',                       ['Single-column', 'Compact', 'ATS'],          '#374151'), component: wrap(CompactTemplate) },
  consultant:   { meta: meta('consultant',   'Consultant',   'Polished layout for consulting and advisory roles.',          ['Two-column', 'Business', 'Professional'],    '#1e40af'), component: wrap(ConsultantTemplate) },
  corporate:    { meta: meta('corporate',    'Corporate',    'Clean corporate style for business roles.',                   ['Single-column', 'Corporate', 'ATS'],         '#1e3a5f'), component: wrap(CorporateTemplate) },
  creative:     { meta: meta('creative',     'Creative',     'Vibrant creative layout for artistic roles.',                  ['Two-column', 'Creative', 'Colorful'],        '#7c3aed'), component: wrap(CreativeTemplate) },
  designer:     { meta: meta('designer',     'Designer',     'Elegant layout crafted for UX/UI designers.',                 ['Two-column', 'Design', 'Creative'],          '#db2777'), component: wrap(DesignerTemplate) },
  developer:    { meta: meta('developer',    'Developer',    'Tech-focused layout for software developers.',                 ['Two-column', 'Tech', 'Developer'],           '#0284c7'), component: wrap(DeveloperTemplate) },
  elegant:      { meta: meta('elegant',      'Elegant',      'Sophisticated design with refined typography.',                ['Single-column', 'Elegant', 'Professional'],  '#44403c'), component: wrap(ElegantTemplate) },
  engineer:     { meta: meta('engineer',     'Engineer',     'Technical layout for engineering professionals.',              ['Two-column', 'Tech', 'Engineering'],         '#1d4ed8'), component: wrap(EngineerTemplate) },
  euro:         { meta: meta('euro',         'Euro',         'European-style CV with photo support.',                        ['Single-column', 'European', 'Classic'],      '#374151'), component: wrap(EuroTemplate) },
  executive:    { meta: meta('executive',    'Executive',    'Power layout for C-suite and senior leaders.',                 ['Single-column', 'Executive', 'Senior'],      '#111827'), component: wrap(ExecutiveTemplate) },
  finance:      { meta: meta('finance',      'Finance',      'Formal layout for finance and banking roles.',                 ['Single-column', 'Finance', 'ATS'],           '#14532d'), component: wrap(FinanceTemplate) },
  formal:       { meta: meta('formal',       'Formal',       'Traditional formal resume for conservative industries.',       ['Single-column', 'Formal', 'ATS'],           '#18181b'), component: wrap(FormalTemplate) },
  gradient:     { meta: meta('gradient',     'Gradient',     'Colorful gradient accents for modern appeal.',                 ['Two-column', 'Gradient', 'Colorful'],        '#7c3aed'), component: wrap(GradientTemplate) },
  infographic:  { meta: meta('infographic',  'Infographic',  'Visual infographic-style layout.',                             ['Two-column', 'Infographic', 'Creative'],     '#0891b2'), component: wrap(InfographicTemplate) },
  japanese:     { meta: meta('japanese',     'Japanese',     'Japanese rirekisho-inspired compact layout.',                  ['Single-column', 'Compact', 'Asian'],         '#b45309'), component: wrap(JapaneseTemplate) },
  legal:        { meta: meta('legal',        'Legal',        'Conservative formal layout for legal professionals.',          ['Single-column', 'Legal', 'ATS'],            '#1e3a5f'), component: wrap(LegalTemplate) },
  luxe:         { meta: meta('luxe',         'Luxe',         'Premium high-end layout for luxury positioning.',              ['Two-column', 'Luxury', 'Premium'],           '#78350f'), component: wrap(LuxeTemplate) },
  magazine:     { meta: meta('magazine',     'Magazine',     'Editorial magazine-style layout.',                             ['Two-column', 'Editorial', 'Creative'],       '#be123c'), component: wrap(MagazineTemplate) },
  material:     { meta: meta('material',     'Material',     'Google Material Design-inspired layout.',                      ['Two-column', 'Material', 'Modern'],          '#1565c0'), component: wrap(MaterialTemplate) },
  medical:      { meta: meta('medical',      'Medical',      'Clean structured layout for healthcare professionals.',        ['Single-column', 'Medical', 'ATS'],          '#0f766e'), component: wrap(MedicalTemplate) },
  metro:        { meta: meta('metro',        'Metro',        'Metropolitan tile-inspired modern layout.',                    ['Two-column', 'Modern', 'Urban'],             '#0ea5e9'), component: wrap(MetroTemplate) },
  minimal:      { meta: meta('minimal',      'Minimal',      'Ultra-minimal whitespace-first design.',                       ['Single-column', 'Minimal', 'ATS'],          '#6b7280'), component: wrap(MinimalTemplate) },
  modern:       { meta: meta('modern',       'Modern',       'Contemporary two-column layout with strong header.',           ['Two-column', 'Modern', 'Tech'],              '#4f46e5'), component: wrap(ModernTemplate) },
  mosaic:       { meta: meta('mosaic',       'Mosaic',       'Asymmetric mosaic grid layout.',                               ['Two-column', 'Creative', 'Grid'],            '#7c3aed'), component: wrap(MosaicTemplate) },
  neon:         { meta: meta('neon',         'Neon',         'Dark background with neon accent highlights.',                 ['Two-column', 'Dark', 'Creative'],            '#6d28d9'), component: wrap(NeonTemplate) },
  nordic:       { meta: meta('nordic',       'Nordic',       'Scandinavian minimalism with warm tones.',                     ['Single-column', 'Minimal', 'Clean'],         '#64748b'), component: wrap(NordicTemplate) },
  professional: { meta: meta('professional', 'Professional', 'Polished professional layout for any industry.',               ['Single-column', 'Professional', 'ATS'],      '#1e3a5f'), component: wrap(ProfessionalTemplate) },
  retro:        { meta: meta('retro',        'Retro',        'Vintage-inspired layout with retro typography.',               ['Single-column', 'Retro', 'Creative'],        '#92400e'), component: wrap(RetroTemplate) },
  ribbon:       { meta: meta('ribbon',       'Ribbon',       'Ribbon accent layout with strong visual hierarchy.',           ['Two-column', 'Modern', 'Colorful'],          '#be185d'), component: wrap(RibbonTemplate) },
  rose:         { meta: meta('rose',         'Rose',         'Soft rose accents for a warm professional look.',              ['Two-column', 'Elegant', 'Soft'],             '#be185d'), component: wrap(RoseTemplate) },
  scientist:    { meta: meta('scientist',    'Scientist',    'Research-focused layout for scientists and academics.',         ['Single-column', 'Academic', 'ATS'],         '#1e40af'), component: wrap(ScientistTemplate) },
  sidebar:      { meta: meta('sidebar',      'Sidebar',      'Bold dark sidebar with clean main content.',                   ['Two-column', 'Sidebar', 'Professional'],     '#1e40af'), component: wrap(SidebarTemplate) },
  startup:      { meta: meta('startup',      'Startup',      'Fresh energetic layout for startup roles.',                    ['Two-column', 'Startup', 'Modern'],           '#0891b2'), component: wrap(StartupTemplate) },
  swiss:        { meta: meta('swiss',        'Swiss',        'Swiss International Typographic Style grid layout.',           ['Single-column', 'Swiss', 'Minimal'],         '#374151'), component: wrap(SwissTemplate) },
  teacher:      { meta: meta('teacher',      'Teacher',      'Warm structured layout for educators.',                        ['Single-column', 'Education', 'ATS'],         '#854d0e'), component: wrap(TeacherTemplate) },
  timeline:     { meta: meta('timeline',     'Timeline',     'Visual timeline layout for career progression.',               ['Two-column', 'Timeline', 'Visual'],          '#0f766e'), component: wrap(TimelineTemplate) },
  'two-column': { meta: meta('two-column',   'Two Column',   'Dark sidebar two-column layout.',                              ['Two-column', 'Sidebar', 'Modern'],           '#1a1a2e'), component: wrap(TwoColumnTemplate) },
  watercolor:   { meta: meta('watercolor',   'Watercolor',   'Soft watercolor-inspired artistic layout.',                    ['Two-column', 'Artistic', 'Soft'],            '#0891b2'), component: wrap(WatercolorTemplate) },
  zigzag:       { meta: meta('zigzag',       'Zigzag',       'Dynamic zigzag pattern with bold contrasts.',                  ['Two-column', 'Dynamic', 'Bold'],             '#dc2626'), component: wrap(ZigzagTemplate) },
} as const satisfies Record<TemplateId, TemplateConfig>

// eslint-disable-next-line react-refresh/only-export-components
export function getTemplate(id: TemplateId): TemplateConfig {
  return TEMPLATE_REGISTRY[id]
}

// eslint-disable-next-line react-refresh/only-export-components
export function listTemplates(): TemplateConfig[] {
  return TEMPLATE_IDS.map(id => TEMPLATE_REGISTRY[id])
}
