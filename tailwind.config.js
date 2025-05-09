export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        spoqa: ['Spoqa Han Sans Neo', 'sans-serif'], // 'font-spoqa' 클래스로 사용
      },
      fontSize: {
        'system-10': '10px', // system 11 (B), system 12 (M) - line-height: 14px
        'system-12': '12px', // system 09 (B), system 10 (M) - line-height: 18px
        'system-14': '14px', // system 07 (B), system 08 (M) - line-height: 20px
        'system-16': '16px', // system 05 (B), system 06 (M) - line-height: 24px
        'system-18': '18px', // system 03 (B), system 04 (M) - line-height: 26px
        'system-20': '20px', // system 01 (B), system 02 (M), Name, Typeface 등 - line-height: 28px 또는 22px
        'system-32': '32px', // 'font' 제목 스타일 - line-height: 40px
      },
      fontWeight: {
        // CSS 명세에 따라 font-weight 값 직접 사용 또는 medium: 500, bold: 700 등으로 정의
        // 'Spoqa Han Sans Neo'는 보통 100(Thin)부터 700(Bold)까지 다양한 웨이트를 가집니다.
        // CSS 에서 font-weight: 500; -> .font-medium
        // CSS 에서 font-weight: 700; -> .font-bold
        // 이미 Tailwind에 medium, bold가 있으므로, 필요시 추가 정의
      },
      lineHeight: {
        14: '14px', // 10px font
        18: '18px', // 12px font
        20: '20px', // 14px font
        22: '22px', // 20px font (Name, Typeface 등)
        24: '24px', // 16px font
        26: '26px', // 18px font
        28: '28px', // 20px font
        40: '40px', // 32px font
      },
      letterSpacing: {
        // Tailwind 기본값에 'tighter' (-0.05em) 등이 있지만, 정확히 -0.01em이 필요하면 커스텀 정의
        'custom-tighter': '-0.01em', // 예: .tracking-custom-tighter
      },
      colors: {
        'droni-blue': {
          100: '#D0DFFF',
          200: '#A2BFFF',
          300: '#73A0FF',
          400: '#4580FF',
          500: '#1660FF', // 기준
          600: '#124DCC',
          700: '#0D3A99',
          800: '#092666',
          900: '#041333',
        },
        gray: {
          100: '#F7F8FA',
          200: '#EBEDF0',
          300: '#CED0D6',
          400: '#9EA1AC',
          500: '#6D7183',
          600: '#3D4259',
          700: '#2D3247',
          800: '#202332',
          900: '#02040A',
        },
        white: '#FFFFFF',
        black: '#000000',
      },
    },
  },
  plugins: [],
};
