import { Eye, MessageCircle, Home as HomeIcon } from 'lucide-react'
import { useLang } from '../../contexts/LangContext'

const STEPS = [
  { icon: Eye, titleKey: 'step1_title', descKey: 'step1_desc', num: '01' },
  { icon: MessageCircle, titleKey: 'step2_title', descKey: 'step2_desc', num: '02' },
  { icon: HomeIcon, titleKey: 'step3_title', descKey: 'step3_desc', num: '03' },
]

export default function HowItWorks() {
  const { t } = useLang()

  return (
    <section className="bg-stone-50 border-t border-stone-200 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-800">
            {t('how_title')}
          </h2>
          <p className="text-stone-500 mt-3 text-base max-w-xl mx-auto">
            Finding your next property in Ethiopia has never been easier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-stone-200 z-0" />
          {STEPS.map(({ icon: Icon, titleKey, descKey, num }) => (
            <div key={num} className="relative z-10 text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white border-2 border-stone-100 text-terracotta mb-5 shadow-sm group-hover:border-terracotta group-hover:shadow-terracotta/10 group-hover:shadow-lg transition-all">
                <Icon size={32} />
              </div>
              <div className="text-xs font-bold text-terracotta mb-2 tracking-widest">{num}</div>
              <h3 className="font-display font-bold text-xl text-stone-800 mb-2">{t(titleKey)}</h3>
              <p className="text-stone-500 leading-relaxed text-sm max-w-xs mx-auto">{t(descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
