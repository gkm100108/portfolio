/**
 * GuGyeongMo—Portfolio 데이터 파일
 * 전체 섹션 구조와 애니메이션을 유지하면서 눈이 편한 저채도 컬러 팔레트를 적용했습니다.
 */
window.PORTFOLIO_DATA = {
  brand: {
    name: 'GuGyeongMo—Portfolio',
    mainName: 'GuGyeongMo',
    subName: '—Portfolio',
    tagline: 'Where creativity meets interaction.',
    coreMessage: "I don't just build websites. I create experiences.",
    description:
      'GuGyeongMo—Portfolio | UI/UX, React, 인터랙션과 모션을 중심으로 웹 경험을 설계하는 프론트엔드 개발자 포트폴리오'
  },

  profile: {
    name: 'GU GYEONGMO',
    role: 'FRONTEND DEVELOPER',
    headline: "I don't just build websites.\nI create experiences.",
    summary:
      'UI/UX 설계부터 HTML/CSS/JavaScript, React 컴포넌트 아키텍처, 그리고 사용자 경험을 완성하는 인터랙션과 모션까지 고민하는 프론트엔드 개발자입니다.',
    stats: [
      { value: '00+', label: '[지표 1: 프로젝트]' },
      { value: '00+', label: '[지표 2: 협업 / 대회]' },
      { value: '100%', label: 'UX & Interaction' }
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/your-username' },
      { label: 'Email', url: 'mailto:your-email@example.com' },
      { label: 'Blog', url: 'https://example.com' }
    ]
  },

  marquee: [
    'REACT',
    'TYPESCRIPT',
    'JAVASCRIPT',
    'HTML5 & CSS3',
    'UI/UX DESIGN',
    'INTERACTIVE MOTION',
    'RESPONSIVE WEB',
    'GIT & GITHUB'
  ],

  about: {
    lead: '단순히 동작하는 화면을 넘어 [[직관적인 인터페이스]], [[부드러운 인터랙션]], 그리고 [[창의적인 웹 구현]]으로 사용자가 기억하는 경험을 만듭니다. 보이지 않는 코드 구조와 성능까지 세밀하게 설계합니다.',
    cards: [
      {
        title: 'UI/UX & Responsive',
        description:
          '사용자 흐름을 먼저 설계하고, 데스크톱부터 모바일 환경까지 일관된 반응형 레이아웃을 구현합니다.',
        tags: ['UI/UX', 'Responsive']
      },
      {
        title: 'Component Architecture',
        description:
          '재사용성과 유지보수성을 고려해 명확한 책임 분리를 갖춘 React 컴포넌트 구조를 설계합니다.',
        tags: ['React', 'Clean Code']
      },
      {
        title: 'Motion & Interaction',
        description:
          'CSS 애니메이션과 JavaScript 기반 인터랙션으로 정적인 웹에 생동감을 불어넣습니다.',
        tags: ['Animation', 'Canvas/DOM']
      }
    ]
  },

  projects: [
    {
      title: '[PROJECT 01 TITLE]',
      period: '2026',
      metric: '[핵심 지표 01]',
      metricSub: '[성과 요약]',
      description: '[프로젝트의 핵심 목적과 UI/UX 및 인터랙션 구현 포인트를 입력하세요.]',
      techStack: ['React', 'JavaScript', 'CSS3'],
      url: 'https://github.com/your-username/project-1'
    },
    {
      title: '[PROJECT 02 TITLE]',
      period: '2026',
      metric: '[핵심 지표 02]',
      metricSub: '[성과 요약]',
      description: '[두 번째 프로젝트의 개요와 창의적인 웹 구현 요소를 입력하세요.]',
      techStack: ['HTML5', 'CSS3', 'JavaScript'],
      url: 'https://github.com/your-username/project-2'
    },
    {
      title: '[PROJECT 03 TITLE]',
      period: '2026',
      metric: '[핵심 지표 03]',
      metricSub: '[성과 요약]',
      description: '[세 번째 프로젝트의 반응형 설계 및 상태 관리 구현 내용을 입력하세요.]',
      techStack: ['React', 'UI/UX', 'Motion'],
      url: 'https://github.com/your-username/project-3'
    }
  ],

  experience: {
    targetPercent: 100,
    caption: 'UI/UX 완성도와 인터랙션 디테일에 집중하며 실전 프로젝트로 성장해 온 기록입니다.',
    items: [
      {
        period: 'NOW',
        title: '[현재 소속 / 프론트엔드 개발 활동]',
        org: '[학교 / 동아리 / 팀명]',
        badge: 'ACTIVE'
      },
      {
        period: '2026',
        title: '[해커톤 / 공모전 / 팀 프로젝트]',
        org: '[주최 기관 / 프로젝트명]',
        badge: 'PROJECT'
      },
      {
        period: '2026',
        title: '[웹 개발 학습 및 스터디 활동]',
        org: '[과정명 / 활동 내역]',
        badge: 'STUDY'
      }
    ]
  },

  deploys: {
    subcopy:
      '아이디어를 화면 위에서 실제로 동작하는 인터랙션과 컴포넌트로 빠르게 구현하고 검증합니다.',
    quote: "I DON'T JUST BUILD WEBSITES.\nI CREATE EXPERIENCES."
  },

  skills: [
    {
      category: 'Frontend Systems',
      description: '컴포넌트 중심 UI 설계와 상태 관리 및 웹 표준 마크업',
      items: ['React', 'JavaScript (ES6+)', 'HTML5', 'CSS3']
    },
    {
      category: 'UI/UX & Styling',
      description: '반응형 레이아웃과 디자인 시스템 기반 인터페이스 구현',
      items: ['Responsive Web', 'CSS Animation', 'Figma', '[스타일링 도구]']
    },
    {
      category: 'Interactive Motion',
      description: '사용자 경험을 높이는 동적 인터랙션과 캔버스/DOM 모션',
      items: ['DOM Choreography', 'Canvas 2D/3D', 'Micro-Interactions']
    },
    {
      category: 'API & Data Flow',
      description: '비동기 통신, REST API 연동 및 데이터 시각화 처리',
      items: ['REST API', 'JSON', 'Async/Await', '[추가 기술]']
    },
    {
      category: 'Workflow & Version Control',
      description: '협업을 위한 버전 관리와 개발 환경 구성',
      items: ['Git', 'GitHub', 'WebStorm', 'VS Code']
    },
    {
      category: 'Deployment & Web Perf',
      description: '정적/동적 웹 호스팅 배포 및 렌더링 최적화',
      items: ['Vercel', 'Web Performance', 'Cross-Browsing']
    }
  ],

  contact: {
    message: '새로운 프로젝트 협업이나 프론트엔드 관련 이야기는 언제든 환영합니다.',
    subMessage: 'Usually reply within a day.',
    email: 'your-email@example.com',
    github: 'https://github.com/your-username',
    blog: 'https://example.com'
  },

  // 눈이 편한 저채도 역할 커서 색상
  agents: [
    { id: 'layout', name: 'LAYOUT', color: '#D96B5A' },
    { id: 'design', name: 'DESIGN', color: '#D99B66' },
    { id: 'development', name: 'DEVELOPMENT', color: '#6BA8C9' },
    { id: 'interaction', name: 'INTERACTION', color: '#A384C9' },
    { id: 'motion', name: 'MOTION', color: '#69B88A' }
  ]
};
