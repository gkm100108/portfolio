/**
 * GuGyeongMo—Portfolio 데이터 파일
 * 임의의 허구 경력/수치 없이 실제 포트폴리오에 바로 채워 넣을 수 있는 구조로 정리했습니다.
 */
window.PORTFOLIO_DATA = {
  brand: {
    name: 'GuGyeongMo—Portfolio',
    tagline: 'Where creativity meets interaction.',
    coreMessage: "I don't just build websites. I create experiences.",
    subcopy:
      'UI/UX 설계부터 컴포넌트 아키텍처, 인터랙션과 모션까지 사용자 경험을 코드로 완성합니다.'
  },

  hero: {
    greeting: 'HELLO, I AM',
    name: 'GU GYEONGMO',
    roleBadge: 'FRONTEND DEVELOPER',
    secondaryBadge: 'UI/UX & INTERACTION',
    location: 'Daegu, South Korea',
    headlineTop: "I don't just build",
    headlineAccent: 'websites.',
    headlineBottom: 'I create',
    headlineAccent2: 'experiences.',
    summary:
      '직관적인 인터페이스와 부드러운 인터랙션으로 사용자가 오래 기억하는 웹 경험을 설계하고 구현하는 프론트엔드 개발자입니다.',
    links: [
      { label: 'GitHub', href: 'https://github.com/your-username' },
      { label: 'Email', href: 'mailto:your-email@example.com' },
      { label: 'Blog', href: 'https://example.com' }
    ]
  },

  highlights: [
    { label: 'FOCUS 01', value: 'UI/UX Design', desc: '사용자 흐름 중심의 화면 설계' },
    { label: 'FOCUS 02', value: 'Component Arch', desc: '재사용 가능한 모듈형 구조' },
    { label: 'FOCUS 03', value: 'Motion & Canvas', desc: '자연스러운 인터랙션 구현' },
    { label: 'FOCUS 04', value: 'Responsive Web', desc: '디바이스별 일관된 경험' }
  ],

  about: {
    eyebrow: '01 / ABOUT & PHILOSOPHY',
    title: 'Design-Driven Frontend Engineering',
    lead: '단순히 동작하는 화면을 넘어 직관적인 인터페이스, 부드러운 인터랙션, 그리고 창의적인 웹 구현으로 사용자가 기억하는 경험을 만듭니다.',
    description:
      '보이지 않는 코드 구조와 렌더링 성능까지 세밀하게 설계하여, 시각적 완성도와 엔지니어링 품질이 함께 가는 웹 제품을 지향합니다.',
    slabQuote:
      '좋은 인터페이스는 설명이 필요 없고, 좋은 모션은 사용자의 시선과 맥락을 자연스럽게 이어줍니다.',
    slabCaption: 'CORE PRINCIPLE · INTERACTION & ARCHITECTURE',
    strengths: [
      {
        title: 'UI/UX & Responsive',
        tag: 'Layout · Design',
        desc: '사용자 흐름을 먼저 설계하고, 데스크톱부터 모바일 환경까지 일관된 반응형 레이아웃을 구현합니다.'
      },
      {
        title: 'Component Architecture',
        tag: 'React · Clean Code',
        desc: '재사용성과 유지보수성을 고려해 명확한 책임 분리를 갖춘 컴포넌트 구조를 설계합니다.'
      },
      {
        title: 'Motion & Interaction',
        tag: 'Animation · DOM',
        desc: 'CSS 애니메이션과 JavaScript 기반 인터랙션으로 정적인 웹에 생동감을 불어넣습니다.'
      }
    ]
  },

  projects: [
    {
      index: '01',
      title: '[PROJECT 01 — 프로젝트명을 입력하세요]',
      role: '[담당 역할: Frontend / UI·UX]',
      period: '[진행 기간]',
      description:
        '[프로젝트의 핵심 목적과 본인이 구현한 UI/UX, 상태 관리 또는 인터랙션 포인트를 작성해 주세요.]',
      highlights: ['[핵심 구현 1]', '[핵심 구현 2]'],
      tags: ['React', 'JavaScript', 'CSS3'],
      link: 'https://github.com/your-username'
    },
    {
      index: '02',
      title: '[PROJECT 02 — 프로젝트명을 입력하세요]',
      role: '[담당 역할: Frontend / Interaction]',
      period: '[진행 기간]',
      description:
        '[두 번째 프로젝트의 개요와 반응형 레이아웃, API 연동 또는 모션 설계 내용을 작성해 주세요.]',
      highlights: ['[핵심 구현 1]', '[핵심 구현 2]'],
      tags: ['HTML5', 'CSS3', 'JavaScript'],
      link: 'https://github.com/your-username'
    },
    {
      index: '03',
      title: '[PROJECT 03 — 프로젝트명을 입력하세요]',
      role: '[담당 역할: Frontend Developer]',
      period: '[진행 기간]',
      description:
        '[세 번째 프로젝트의 문제 해결 과정과 성능/사용자 경험 개선 포인트를 작성해 주세요.]',
      highlights: ['[핵심 구현 1]', '[핵심 구현 2]'],
      tags: ['React', 'TypeScript', 'UI/UX'],
      link: 'https://github.com/your-username'
    }
  ],

  experience: [
    {
      period: '[기간]',
      org: '[소속 / 팀명]',
      role: '[활동 또는 직무명]',
      detail: '[주요 수행 업무와 협업 경험을 간결하게 작성해 주세요.]'
    },
    {
      period: '[기간]',
      org: '[교육 / 스터디 / 대회]',
      role: '[참여 역할 및 내용]',
      detail: '[프론트엔드 역량을 키우기 위해 진행한 학습이나 프로젝트 경험을 작성해 주세요.]'
    }
  ],

  skillGroups: [
    {
      category: 'Frontend Core',
      accent: '#4B8EB3',
      description: '컴포넌트 중심 UI 설계와 웹 표준 마크업',
      items: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React']
    },
    {
      category: 'UI/UX & Motion',
      accent: '#8867B5',
      description: '반응형 레이아웃과 사용자 경험 중심 인터랙션',
      items: ['Responsive Web', 'CSS Animation', 'Canvas 2D', 'DOM Choreography']
    },
    {
      category: 'Workflow & Tools',
      accent: '#4C9E70',
      description: '협업과 버전 관리 및 웹 배포 환경',
      items: ['Git', 'GitHub', 'REST API', 'Vercel']
    }
  ],

  contact: {
    eyebrow: '05 / CONTACT',
    headline: "Let's build something memorable.",
    subcopy:
      '새로운 프로젝트 협업이나 프론트엔드 관련 이야기는 언제든 환영합니다. 편한 채널로 연락해 주세요.',
    email: 'your-email@example.com',
    github: 'https://github.com/your-username',
    blog: 'https://example.com'
  },

  // 5개 역할별 커서 컬러 (라이트 배경에서 눈이 편하고 구분이 명확한 톤)
  agents: [
    { id: 'layout', label: 'LAYOUT', color: '#D15B4A' },
    { id: 'design', label: 'DESIGN', color: '#CC874B' },
    { id: 'development', label: 'DEVELOPMENT', color: '#4B8EB3' },
    { id: 'interaction', label: 'INTERACTION', color: '#8867B5' },
    { id: 'motion', label: 'MOTION', color: '#4C9E70' }
  ]
};
