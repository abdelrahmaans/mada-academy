import { ContentItem, Faq, GalleryItem, Testimonial } from '../models/content.models';
import { StarStudent, Track } from '../models/track.models';

export const madaTracks: Track[] = [
  {
    id: 'tiny',
    slug: 'mada-tiny',
    title: 'Mada Tiny',
    age: '6-7',
    focus: 'تفكير منطقي مبكر وأنماط',
    tools: ['Scratch Jr', 'Code.org', 'روبوتات بسيطة'],
    outcome: 'طفل يشرح فكرته بخطوات واضحة',
    description: 'مدخل لطيف لعالم التفكير البرمجي من خلال اللعب المنظم.',
    is_published: true,
    sort_order: 1
  },
  {
    id: 'explore',
    slug: 'mada-explore',
    title: 'Mada Explore',
    age: '8-10',
    focus: 'حل المشكلات وبناء ألعاب صغيرة',
    tools: ['Scratch', 'Blockly', 'Puzzles'],
    outcome: 'مشروع لعبة قابل للعرض',
    description: 'رحلة استكشاف تجعل الطفل يبني ويتعلم من التجربة.',
    is_published: true,
    sort_order: 2
  },
  {
    id: 'build',
    slug: 'mada-build',
    title: 'Mada Build',
    age: '11-13',
    focus: 'مشاريع حقيقية وتصميم منطقي',
    tools: ['Scratch Advanced', 'Python Basics', 'AI tools'],
    outcome: 'نماذج أولية وحلول لمشكلات واقعية',
    description: 'من فكرة إلى مشروع، مع تدريب على التفكير والتحسين.',
    is_published: true,
    sort_order: 3
  },
  {
    id: 'code',
    slug: 'mada-code',
    title: 'Mada Code',
    age: '14-16',
    focus: 'أساسيات البرمجة الجادة',
    tools: ['Python', 'JavaScript', 'Git'],
    outcome: 'قدرة على بناء برامج صغيرة بثقة',
    description: 'مسار عميق للمراهقين الذين يريدون فهم الكود بجدية.',
    is_published: true,
    sort_order: 4
  },
  {
    id: 'web',
    slug: 'mada-web',
    title: 'Mada Web',
    age: '11-16',
    focus: 'واجهات ويب وتجربة مستخدم',
    tools: ['HTML', 'CSS', 'JavaScript'],
    outcome: 'صفحة ويب أو تطبيق مصغر منشور',
    description: 'تعلم الويب من التصميم إلى النشر عبر مشاريع عملية.',
    is_published: true,
    sort_order: 5
  }
];

export const madaStars: StarStudent[] = [
  {
    id: 's1',
    student_name: 'ليان',
    avatar_url: null,
    track: 'Mada Explore',
    badge: 'Puzzle Solver',
    xp: 2450,
    project: 'لعبة إنقاذ الكوكب',
    quote: 'اتعلمت أفكر في الحل قبل ما أكتب الكود.',
    highlight_reason: 'قسمت المشكلة الكبيرة لخطوات صغيرة.',
    is_published: true,
    sort_order: 1
  },
  {
    id: 's2',
    student_name: 'عمر',
    avatar_url: null,
    track: 'Mada Web',
    badge: 'Builder',
    xp: 3180,
    project: 'موقع نادي العلوم',
    quote: 'أول مرة أحس إن فكرتي ممكن تبقى موقع حقيقي.',
    highlight_reason: 'ربط التصميم بالوظيفة بدون تشتيت.',
    is_published: true,
    sort_order: 2
  },
  {
    id: 's3',
    student_name: 'مريم',
    avatar_url: null,
    track: 'Mada Code',
    badge: 'Debug Hero',
    xp: 4020,
    project: 'آلة حاسبة ذكية',
    quote: 'الغلط بقى دليل مش نهاية الطريق.',
    highlight_reason: 'استخدمت التتبع المنطقي لإصلاح أخطاء الكود.',
    is_published: true,
    sort_order: 3
  }
];

export const madaContent: ContentItem[] = [
  {
    id: 'c1',
    title: 'إزاي نعلم الطفل يفكر زي المبرمج؟',
    category: 'Parent Guide',
    thumbnail_url: null,
    platform: 'instagram',
    external_link: 'https://instagram.com',
    is_published: true,
    sort_order: 1
  },
  {
    id: 'c2',
    title: 'تحدي 60 ثانية: Puzzle Loop',
    category: 'Reel',
    thumbnail_url: null,
    platform: 'youtube',
    external_link: 'https://youtube.com',
    is_published: true,
    sort_order: 2
  },
  {
    id: 'c3',
    title: 'مشروع طالب: لعبة بالـ Scratch',
    category: 'Project',
    thumbnail_url: null,
    platform: 'tiktok',
    external_link: 'https://tiktok.com',
    is_published: true,
    sort_order: 3
  }
];

export const madaGallery: GalleryItem[] = [
  {
    id: 'g1',
    title: 'جلسة بناء لعبة',
    image_url: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=900&q=80',
    alt_text: 'طلاب يتعلمون البرمجة داخل ورشة تعليمية',
    item_type: 'photo',
    is_published: true,
    sort_order: 1
  },
  {
    id: 'g2',
    title: 'مشروع ويب',
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    alt_text: 'شاشة تعرض مشروع ويب تعليمي',
    item_type: 'project',
    is_published: true,
    sort_order: 2
  },
  {
    id: 'g3',
    title: 'تجربة Puzzle',
    image_url: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=900&q=80',
    alt_text: 'طفل يعمل على نشاط تفكير منطقي',
    item_type: 'photo',
    is_published: true,
    sort_order: 3
  }
];

export const madaTestimonials: Testimonial[] = [
  {
    id: 't1',
    author_name: 'والدة آدم',
    role: 'ولي أمر',
    quote: 'ابني بقى يسأل أسئلة أعمق ويفكر في خطوات الحل بدل ما يستعجل الإجابة.',
    image_url: null,
    rating: 5,
    is_published: true,
    sort_order: 1
  },
  {
    id: 't2',
    author_name: 'يوسف',
    role: 'طالب Mada Code',
    quote: 'أحسن حاجة إننا بنبني مشاريع ونفهم ليه الكود اشتغل.',
    image_url: null,
    rating: 5,
    is_published: true,
    sort_order: 2
  }
];

export const madaFaqs: Faq[] = [
  {
    id: 'f1',
    question: 'هل الطفل محتاج خبرة سابقة؟',
    answer: 'لا. بنبدأ من مستوى الطفل ونبني الثقة خطوة بخطوة.',
    is_published: true,
    sort_order: 1
  },
  {
    id: 'f2',
    question: 'الجلسة مدتها قد إيه؟',
    answer: 'الجلسة 60 دقيقة، مقسمة بين معرفة، لعب تعليمي، تطبيق، وتحدي ختامي.',
    is_published: true,
    sort_order: 2
  },
  {
    id: 'f3',
    question: 'هل في متابعة مع ولي الأمر؟',
    answer: 'نعم، بنشارك تقدم الطفل والمشاريع والنقاط التي يحتاج دعم فيها.',
    is_published: true,
    sort_order: 3
  }
];
