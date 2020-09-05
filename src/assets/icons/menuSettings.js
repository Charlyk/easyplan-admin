import React from 'react';

function MenuSettings() {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M10.8976 2.00206L13.0201 2.00195C13.0843 2.00493 13.1406 2.01227 13.2197 2.0295C13.8002 2.1559 14.0209 2.36432 14.5611 3.6408L14.6491 3.85137L14.9886 4.69255L15.0165 4.70402L15.4539 4.50602C16.4066 4.08002 16.8976 3.90058 17.2278 3.85052L17.2962 3.84173L17.4209 3.835C17.7182 3.835 18.021 3.94031 18.2528 4.12366L18.3624 4.22171L19.7193 5.57302L19.8137 5.67271C20.2399 6.14224 20.2797 6.47511 19.8082 7.68829L19.6513 8.07967L19.2815 8.95464L19.2886 8.97172L20.1357 9.28806L20.5441 9.44947C21.599 9.88078 21.8158 10.1107 21.9568 10.6387C21.9852 10.7452 21.9953 10.8177 21.9986 10.9078L22 11.0055V12.9133C22 13.0489 21.9954 13.1255 21.962 13.2595C21.8216 13.8232 21.6132 14.0379 20.3455 14.5734L20.1363 14.6607L19.301 14.9978L19.2952 15.0119L19.5972 15.6718C20.3484 17.3413 20.3746 17.7073 19.8809 18.2571L19.8192 18.324L18.4263 19.7159C18.1769 19.968 17.8217 20.1067 17.4779 20.1067C17.186 20.1067 16.7275 19.968 15.9459 19.6545L15.5275 19.4831L15.0509 19.2816L15.0236 19.2929L14.7773 19.9533C14.1744 21.5419 13.9678 21.7998 13.3484 21.9597C13.2569 21.9833 13.1914 21.9934 13.1171 21.9975L12.9945 22.0001H11.0856C10.9665 22.0001 10.8993 21.9965 10.7809 21.9708C10.2007 21.845 9.97914 21.6362 9.43788 20.3589L9.34966 20.1482L9.0096 19.3066L8.98344 19.2958L8.34815 19.5814C7.332 20.0287 6.89179 20.1649 6.57806 20.1649C6.28426 20.1649 5.98508 20.0616 5.74708 19.8766L5.63349 19.7773L4.27843 18.424L4.12369 18.2552C3.75208 17.818 3.73381 17.4789 4.18994 16.3119L4.42762 15.7278L4.71777 15.0457L4.71172 15.0311L4.05484 14.7863C2.73708 14.2862 2.33098 14.0559 2.138 13.6354L2.0858 13.5031L2.0422 13.3566C2.01752 13.263 2.00699 13.1959 2.00272 13.1195L2 12.9936V11.0847C2 10.9481 2.00474 10.8708 2.03877 10.7356C2.16566 10.2316 2.34576 10.0078 3.29447 9.58267L3.68766 9.41288L4.69733 9.00457L4.70425 8.98776L4.32674 8.15484C3.70383 6.73997 3.65224 6.30918 4.04525 5.82802L4.09903 5.7649L4.22636 5.62993L5.57616 4.28319C5.82346 4.03452 6.1772 3.89433 6.5215 3.89433C6.76776 3.89433 7.12934 3.99177 7.70805 4.21096L8.29026 4.44176L8.95028 4.71838L8.97734 4.70713L9.22549 4.04231C9.83405 2.44232 10.0513 2.17475 10.6932 2.03105C10.7742 2.01292 10.8319 2.00519 10.8976 2.00206ZM12.523 4.00006H11.4081L11.2509 4.36859C11.1912 4.5151 11.1238 4.68623 11.0478 4.88487L10.6993 5.817C10.6157 6.03768 10.4574 6.22046 10.2538 6.33479L10.1483 6.3861L9.3292 6.72696C9.1224 6.81301 8.89398 6.82667 8.6804 6.76806L8.55432 6.72422L7.58525 6.31575L7.06181 6.10701L6.70998 5.97716L5.91977 6.76558L6.01277 7.00048C6.04911 7.08896 6.09094 7.18788 6.13863 7.29809L6.2997 7.66336L6.70366 8.54646C6.80042 8.75676 6.82065 8.9927 6.76353 9.21417L6.71997 9.34499L6.38503 10.1589C6.29635 10.3744 6.13575 10.551 5.93242 10.6599L5.82733 10.7086L4.73976 11.1457L4.19609 11.3788L4 11.4696V12.5997L4.23463 12.7015C4.32346 12.7386 4.42321 12.7791 4.53477 12.8233L4.90579 12.9673L5.80732 13.3021C6.03461 13.384 6.22321 13.5449 6.34018 13.7533L6.39255 13.8613L6.72754 14.6728C6.81356 14.8812 6.82615 15.1112 6.76566 15.3258L6.7206 15.4523L6.33182 16.3646L6.088 16.9665L5.96921 17.286L6.75948 18.0753L6.99479 17.9823C7.08146 17.947 7.17645 17.9073 7.28 17.8632L8.00585 17.5431L8.5293 17.3021C8.74835 17.1975 8.99663 17.1766 9.22796 17.2409L9.342 17.2801L10.1659 17.6203C10.3843 17.7104 10.5625 17.8744 10.6707 18.0817L10.7189 18.1888L10.9239 18.7061L11.2157 19.4157L11.3846 19.8035L11.4762 20.0001H12.5944L12.7541 19.6236L12.9621 19.0925L13.3007 18.1844C13.3843 17.9618 13.5438 17.7775 13.7492 17.6627L13.8556 17.6113L14.676 17.2727C14.8804 17.1883 15.1058 17.1746 15.317 17.2313L15.4417 17.2738L16.2143 17.6015L16.7781 17.8312L17.0867 17.9502L17.2903 18.0239L18.0815 17.2341L17.929 16.8579L17.7004 16.3363L17.2956 15.454C17.1985 15.2433 17.1782 15.0068 17.2356 14.785L17.2793 14.6539L17.6137 13.8435C17.7019 13.6297 17.861 13.4542 18.0624 13.3453L18.1665 13.2965L19.0876 12.9262L19.5578 12.7291L19.6871 12.6729L20 12.5297V11.4007L19.6863 11.2668L19.2615 11.0987L18.1891 10.6995C17.9623 10.6169 17.7744 10.4558 17.658 10.2474L17.6059 10.1394L17.2715 9.32458C17.1862 9.1167 17.1738 8.88745 17.2341 8.67361L17.279 8.54746L17.5895 7.82156C17.6703 7.6296 17.7406 7.45937 17.8014 7.30892L17.9103 7.03378L18.029 6.71227L17.2384 5.92488L17.0029 6.01804C16.8727 6.07114 16.7235 6.13416 16.5542 6.20775L16.3782 6.28489L15.4554 6.70346C15.2454 6.79966 15.0101 6.81967 14.7891 6.7627L14.6586 6.71927L13.8352 6.3808C13.6196 6.2922 13.443 6.13165 13.334 5.92835L13.2853 5.82327L12.9942 5.09488L12.7832 4.58459L12.6663 4.31319L12.523 4.00006ZM12.0005 8.00006C14.2066 8.00006 16 9.79308 16 11.9992C16 14.2054 14.2065 16.0001 12.0005 16.0001C9.79382 16.0001 8 14.2058 8 11.9992C8 9.79276 9.79369 8.00006 12.0005 8.00006ZM12.0005 10.0001C10.898 10.0001 10 10.8976 10 11.9992C10 13.1013 10.8985 14.0001 12.0005 14.0001C13.1016 14.0001 14 13.1012 14 11.9992C14 10.8977 13.1021 10.0001 12.0005 10.0001Z'
      />
    </svg>
  );
}

export default React.memo(MenuSettings);
