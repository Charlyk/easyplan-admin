import React from 'react';

interface AppLogoWhiteProps {
  className: any;
}

const AppLogoWhite: React.FC<AppLogoWhiteProps> = ({ className }) => {
  return (
    <svg
      width='154'
      height='40'
      className={className}
      viewBox='0 0 154 40'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M154 14.3727C154 17.4421 151.59 19.9756 148.566 19.9756C148.471 19.9756 148.377 19.9756 148.282 19.9756H142.612C142.517 19.1473 142.375 18.3191 142.139 17.5395C141.714 16.0779 141.005 14.7625 140.107 13.6906C139.162 12.5213 137.981 11.6443 136.563 10.9622C134.437 10.0365 131.743 9.84163 129.428 10.3776C128.814 10.5237 128.199 10.7186 127.585 10.9622C126.829 10.5724 125.931 10.3776 125.033 10.3776H120.072H120.024C121.017 9.40314 122.34 8.81849 123.757 8.81849H123.805C123.805 3.9464 127.632 0 132.358 0C135.713 0 138.642 1.99756 140.06 4.92082C140.911 4.33617 141.95 3.99512 143.037 3.99512C145.778 3.99512 148.046 6.09012 148.424 8.81849C148.518 8.81849 148.566 8.81849 148.66 8.81849C151.59 8.81849 154 11.3033 154 14.3727Z'
        fill='#93C1EF'
      />
      <path
        d='M8.83647 14.6152C9.97056 14.6152 11.0574 14.8101 12.0025 15.1999C12.9948 15.5897 13.7981 16.1256 14.5069 16.8564C15.2157 17.5872 15.7355 18.4642 16.1608 19.5361C16.5388 20.6079 16.7279 21.8259 16.7279 23.1901C16.7279 23.5312 16.7279 23.8235 16.6806 24.0671C16.6334 24.3107 16.5861 24.4569 16.5388 24.603C16.4916 24.7492 16.3498 24.8466 16.2081 24.8954C16.0663 24.9441 15.9245 24.9928 15.6883 24.9928H4.34735C4.48912 26.9416 4.96165 28.3545 5.85948 29.2802C6.7573 30.2059 7.89139 30.6444 9.35626 30.6444C10.0651 30.6444 10.6794 30.547 11.1992 30.4008C11.719 30.2059 12.1915 30.0598 12.5695 29.8162C12.9476 29.6213 13.2783 29.4264 13.6091 29.2315C13.8926 29.0366 14.1762 28.9879 14.4597 28.9879C14.6487 28.9879 14.7905 29.0366 14.9322 29.0854C15.074 29.1341 15.1685 29.2802 15.263 29.3777L16.5388 31.0342C16.0663 31.6188 15.4993 32.106 14.885 32.4958C14.2707 32.8856 13.6564 33.2266 12.9948 33.4702C12.3333 33.7138 11.6717 33.86 10.9629 33.9574C10.3013 34.0549 9.59253 34.1036 8.97823 34.1036C7.70238 34.1036 6.52103 33.9087 5.43419 33.4702C4.34735 33.0317 3.40228 32.3984 2.59896 31.5214C1.79565 30.6444 1.13409 29.6213 0.708808 28.3545C0.236269 27.0878 0 25.6262 0 23.9697C0 22.7029 0.189015 21.4849 0.6143 20.3156C1.03958 19.195 1.60663 18.1719 2.36269 17.3436C3.11875 16.5154 4.06383 15.8333 5.15067 15.346C6.23751 14.8588 7.46611 14.6152 8.83647 14.6152ZM8.93098 17.8795C7.65512 17.8795 6.61554 18.2693 5.90673 19.0001C5.19792 19.7309 4.72538 20.8028 4.53637 22.167H12.8058C12.8058 21.5823 12.7113 21.0464 12.5695 20.5105C12.4278 19.9745 12.1915 19.536 11.8607 19.1463C11.5299 18.7565 11.1519 18.4642 10.6321 18.2206C10.1596 18.0257 9.59253 17.8795 8.93098 17.8795Z'
        fill='white'
      />
      <path
        d='M34.7323 33.8119H32.7477C32.3224 33.8119 31.9916 33.7632 31.7554 33.6171C31.5191 33.4709 31.3301 33.2273 31.2356 32.8375L30.8575 31.4733C30.385 31.9118 29.9597 32.3016 29.4872 32.5939C29.0619 32.935 28.5893 33.1786 28.1168 33.4222C27.6443 33.6658 27.1245 33.8119 26.6047 33.9094C26.0849 34.0068 25.4706 34.0555 24.809 34.0555C24.053 34.0555 23.2969 33.9581 22.6826 33.7145C22.0683 33.4709 21.454 33.1786 20.9815 32.7401C20.5089 32.3016 20.1309 31.7657 19.8946 31.1323C19.6111 30.4989 19.5166 29.7681 19.5166 28.8911C19.5166 28.1603 19.7056 27.4782 20.0836 26.7961C20.4617 26.114 21.0287 25.4807 21.8793 24.896C22.7299 24.3114 23.864 23.8729 25.2343 23.4831C26.6519 23.0933 28.4003 22.9472 30.4795 22.9472V21.8266C30.4795 20.5598 30.2432 19.5854 29.7234 19.0008C29.2036 18.3674 28.4476 18.0751 27.4553 18.0751C26.7464 18.0751 26.1321 18.1725 25.6596 18.3187C25.1871 18.5136 24.7618 18.7085 24.431 18.9033C24.1002 19.0982 23.7695 19.2931 23.4387 19.488C23.1551 19.6829 22.8244 19.7316 22.4463 19.7316C22.1628 19.7316 21.8793 19.6341 21.6903 19.488C21.454 19.3418 21.3122 19.1469 21.1705 18.9033L20.3672 17.4417C22.4936 15.4441 24.998 14.4697 27.975 14.4697C29.0619 14.4697 30.007 14.6646 30.8575 15.0057C31.7081 15.3467 32.4169 15.8826 32.984 16.516C33.551 17.1494 34.0235 17.9289 34.3071 18.8059C34.5906 19.6829 34.7796 20.706 34.7796 21.7292V33.8119H34.7323ZM26.1321 30.9861C26.6047 30.9861 26.9827 30.9374 27.3607 30.84C27.7388 30.7425 28.1168 30.6451 28.4476 30.4502C28.7784 30.304 29.1091 30.0604 29.4399 29.8168C29.7707 29.5732 30.0542 29.2809 30.385 28.9398V25.773C29.1091 25.773 28.0223 25.8704 27.1717 26.0166C26.3212 26.1628 25.6124 26.4064 25.0926 26.65C24.5728 26.8936 24.1947 27.2346 23.9585 27.5757C23.7222 27.9167 23.6277 28.3065 23.6277 28.6962C23.6277 29.5245 23.864 30.0604 24.3365 30.4015C24.809 30.7912 25.4233 30.9861 26.1321 30.9861Z'
        fill='white'
      />
      <path
        d='M49.9466 18.6106C49.8048 18.8054 49.7103 18.9516 49.5686 19.0491C49.4268 19.1465 49.285 19.1465 49.0488 19.1465C48.8125 19.1465 48.6235 19.0978 48.34 18.9516C48.1037 18.8054 47.8202 18.708 47.4894 18.5131C47.1586 18.367 46.7806 18.2208 46.4025 18.1234C45.9773 17.9772 45.5047 17.9285 44.9377 17.9285C44.0871 17.9285 43.3783 18.1234 42.9058 18.5131C42.386 18.9029 42.1497 19.3901 42.1497 20.0235C42.1497 20.4132 42.2915 20.7543 42.5277 21.0466C42.764 21.3389 43.142 21.5825 43.5673 21.7774C43.9926 21.9723 44.4651 22.1672 44.9849 22.3621C45.5047 22.5082 46.0718 22.7031 46.6388 22.898C47.2059 23.0929 47.7257 23.3365 48.2927 23.5801C48.8125 23.8237 49.285 24.1648 49.7103 24.5545C50.1356 24.9443 50.4664 25.3828 50.7499 25.9674C51.0334 26.5521 51.1279 27.1367 51.1279 27.9163C51.1279 28.842 50.9862 29.6702 50.6554 30.4498C50.3246 31.2293 49.8521 31.8627 49.2378 32.4473C48.6235 32.9832 47.8674 33.4217 46.9223 33.7628C45.9773 34.1038 44.9849 34.25 43.8036 34.25C43.1893 34.25 42.575 34.2013 41.9607 34.0551C41.3464 33.9577 40.7793 33.7628 40.2123 33.5679C39.6452 33.373 39.1255 33.1294 38.6529 32.8371C38.1804 32.5448 37.7551 32.2524 37.4243 31.9114L38.4639 30.1574C38.6057 29.9625 38.7474 29.7677 38.9364 29.6702C39.1255 29.5728 39.3617 29.5241 39.598 29.5241C39.8815 29.5241 40.1178 29.6215 40.3541 29.7677C40.5903 29.9138 40.8738 30.1087 41.2046 30.3036C41.5354 30.4985 41.9134 30.6446 42.3387 30.8395C42.764 30.9857 43.331 31.0831 43.9926 31.0831C44.5124 31.0831 44.9849 31.0344 45.363 30.8882C45.741 30.7421 46.0245 30.5959 46.308 30.401C46.5443 30.2061 46.7333 29.9625 46.8278 29.6702C46.9223 29.3779 47.0168 29.0856 47.0168 28.7932C47.0168 28.3548 46.8751 27.965 46.6388 27.7214C46.4025 27.4291 46.0245 27.1854 45.5992 26.9906C45.1739 26.7957 44.7014 26.6008 44.1344 26.4059C43.6146 26.2598 43.0475 26.0649 42.4805 25.87C41.9134 25.6751 41.3464 25.4315 40.8266 25.1879C40.3068 24.9443 39.787 24.6032 39.3617 24.1648C38.9364 23.775 38.6057 23.2391 38.3221 22.6544C38.0859 22.0698 37.9441 21.3389 37.9441 20.5107C37.9441 19.7312 38.0859 19.0003 38.3694 18.3182C38.6529 17.6362 39.1255 17.0028 39.6925 16.4668C40.2595 15.9309 40.9684 15.5411 41.8662 15.2001C42.7167 14.9078 43.7091 14.7129 44.8432 14.7129C46.119 14.7129 47.2531 14.9078 48.2927 15.3463C49.3323 15.7848 50.1829 16.3207 50.8917 17.0515L49.9466 18.6106Z'
        fill='white'
      />
      <path
        d='M61.1458 39.0251C61.004 39.3661 60.8622 39.6097 60.626 39.7559C60.437 39.902 60.1062 39.9995 59.6809 39.9995H56.3731L59.8227 32.4477L52.4038 14.9569H56.2786C56.6567 14.9569 56.8929 15.0544 57.0819 15.2005C57.271 15.3954 57.4127 15.5903 57.5072 15.7852L61.4293 25.5781C61.5711 25.9191 61.6656 26.2115 61.7601 26.5525C61.8546 26.8936 61.9491 27.2346 61.9963 27.5756C62.0908 27.2346 62.1854 26.8936 62.3271 26.5525C62.4689 26.2115 62.5634 25.8704 62.7051 25.5294L66.3909 15.7365C66.4855 15.4929 66.6272 15.298 66.8635 15.1518C67.0998 15.0056 67.336 14.9082 67.6195 14.9082H71.1636L61.1458 39.0251Z'
        fill='white'
      />
      <path
        d='M73.7163 39.9988V14.9563H76.4098C76.6933 14.9563 76.9296 15.005 77.1186 15.1512C77.3076 15.2973 77.4494 15.4922 77.4966 15.7845L77.8746 17.5385C78.6307 16.6615 79.4813 15.9794 80.4264 15.4435C81.3714 14.9076 82.5055 14.6152 83.7814 14.6152C84.7737 14.6152 85.7188 14.8101 86.5221 15.2486C87.3727 15.6871 88.0815 16.3205 88.6485 17.1C89.2156 17.8795 89.7354 18.9027 90.0189 20.1207C90.3497 21.3387 90.4914 22.7029 90.4914 24.2133C90.4914 25.6262 90.3024 26.9416 89.9244 28.1597C89.5463 29.3777 89.0266 30.4008 88.365 31.2778C87.7034 32.1548 86.8529 32.8369 85.8605 33.3728C84.8682 33.86 83.7814 34.1036 82.6 34.1036C81.5604 34.1036 80.6626 33.9574 79.9538 33.6164C79.245 33.2754 78.5835 32.8369 78.0164 32.2522V39.9988H73.7163ZM82.3165 18.1719C81.4187 18.1719 80.6154 18.3667 79.9538 18.7565C79.2923 19.1463 78.678 19.7309 78.1582 20.4617V28.9392C78.678 29.5726 79.1978 30.0111 79.8121 30.2547C80.3791 30.4983 81.0407 30.6444 81.7022 30.6444C82.3638 30.6444 82.9781 30.4983 83.4979 30.2547C84.0176 30.0111 84.4902 29.6213 84.8682 29.0854C85.2463 28.5494 85.5298 27.8673 85.7188 27.0878C85.9078 26.3083 86.0023 25.3338 86.0023 24.262C86.0023 23.1414 85.9078 22.2157 85.766 21.4362C85.577 20.6566 85.3408 20.0233 85.01 19.5848C84.6792 19.1463 84.3012 18.7565 83.8286 18.5129C83.4034 18.2693 82.8836 18.1719 82.3165 18.1719Z'
        fill='white'
      />
      <path
        d='M98.6182 6.43066V33.8118H94.2236V6.43066H98.6182Z'
        fill='white'
      />
      <path
        d='M117.993 33.8119H116.008C115.583 33.8119 115.252 33.7632 115.016 33.6171C114.78 33.4709 114.591 33.2273 114.496 32.8375L114.118 31.4733C113.646 31.9118 113.22 32.3016 112.748 32.5939C112.323 32.935 111.85 33.1786 111.378 33.4222C110.905 33.6658 110.385 33.8119 109.865 33.9094C109.346 34.0068 108.731 34.0555 108.07 34.0555C107.314 34.0555 106.558 33.9581 105.943 33.7145C105.329 33.4709 104.715 33.1786 104.242 32.7401C103.77 32.3016 103.392 31.7657 103.155 31.1323C102.872 30.4989 102.777 29.7681 102.777 28.8911C102.777 28.1603 102.966 27.4782 103.344 26.7961C103.722 26.114 104.289 25.4807 105.14 24.896C105.991 24.3114 107.125 23.8729 108.495 23.4831C109.913 23.0933 111.661 22.9472 113.74 22.9472V21.8266C113.74 20.5598 113.504 19.5854 112.984 19.0008C112.464 18.3674 111.708 18.0751 110.716 18.0751C110.007 18.0751 109.393 18.1725 108.92 18.3187C108.448 18.5136 108.023 18.7085 107.692 18.9033C107.361 19.0982 107.03 19.2931 106.699 19.488C106.416 19.6829 106.085 19.7316 105.707 19.7316C105.424 19.7316 105.14 19.6341 104.951 19.488C104.715 19.3418 104.573 19.1469 104.431 18.9033L103.628 17.4417C105.754 15.4441 108.259 14.4697 111.236 14.4697C112.323 14.4697 113.268 14.6646 114.118 15.0057C114.969 15.3467 115.678 15.8826 116.245 16.516C116.812 17.1494 117.284 17.9289 117.568 18.8059C117.851 19.6829 118.04 20.706 118.04 21.7292V33.8119H117.993ZM109.393 30.9861C109.865 30.9861 110.243 30.9374 110.621 30.84C111 30.7425 111.378 30.6451 111.708 30.4502C112.039 30.304 112.37 30.0604 112.701 29.8168C113.031 29.5732 113.315 29.2809 113.646 28.9398V25.773C112.37 25.773 111.283 25.8704 110.432 26.0166C109.582 26.1628 108.873 26.4064 108.353 26.65C107.834 26.8936 107.455 27.2346 107.219 27.5757C106.983 27.9167 106.888 28.3065 106.888 28.6962C106.888 29.5245 107.125 30.0604 107.597 30.4015C108.07 30.7912 108.637 30.9861 109.393 30.9861Z'
        fill='white'
      />
      <path
        d='M122.292 33.8113V14.9076H124.986C125.553 14.9076 125.931 15.1999 126.12 15.7358L126.404 17.2462C126.782 16.8564 127.16 16.5153 127.585 16.1743C128.01 15.8333 128.435 15.5897 128.908 15.346C129.381 15.1024 129.853 14.9563 130.373 14.8101C130.893 14.664 131.46 14.6152 132.074 14.6152C133.066 14.6152 133.964 14.8101 134.72 15.1512C135.476 15.4922 136.138 15.9794 136.658 16.6128C137.177 17.2462 137.555 17.977 137.839 18.854C138.123 19.7309 138.264 20.7053 138.264 21.7772V33.8113H133.87V21.7772C133.87 20.6079 133.633 19.7309 133.114 19.0976C132.594 18.4642 131.838 18.1719 130.798 18.1719C130.042 18.1719 129.333 18.3667 128.672 18.7078C128.01 19.0488 127.396 19.536 126.782 20.1694V33.8113H122.292Z'
        fill='white'
      />
    </svg>
  );
};

export default React.memo(AppLogoWhite);