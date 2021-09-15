import React from "react";
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const IconsUploadCSV = ({ title, subtitle }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <svg xmlns="http://www.w3.org/2000/svg" width="230" height="165" viewBox="0 0 230 165">
        <g fill="none" fillRule="evenodd">
          <g>
            <g transform="translate(-689 -236) translate(689 236)">
              <rect width="230" height="165" fill="#FFF" rx="8"/>
              <g transform="translate(87 37)">
                <path fill="#F0F5F7" fillRule="nonzero" d="M9.333 0L9.333 56 42 56 56 42 56 0z"/>
                <rect width="35" height="3.5" x="15.167" y="8.167" fill="#D3DEE5" rx="1.75"/>
                <rect width="35" height="3.5" x="15.167" y="16.333" fill="#D3DEE5" rx="1.75"/>
                <rect width="35" height="3.5" x="15.167" y="24.5" fill="#D3DEE5" rx="1.75"/>
                <rect width="35" height="3.5" x="15.167" y="33.833" fill="#D3DEE5" rx="1.75"/>
                <path fill="#D3DEE5" fillRule="nonzero" d="M42 42L42 56 56 42z"/>
                <path fill="#F0F5F7" fillRule="nonzero" d="M28 56L42 56 42 42z"/>
                <path fill="#00C5BB" fillRule="nonzero" d="M0 14L0 30.333 37.333 30.333 37.333 14z"/>
                <g fill="#FFF" fillRule="nonzero">
                  <path
                    d="M4.276 2.058c-.173-.334-.488-.5-.945-.5-.252 0-.46.068-.623.206-.163.135-.292.352-.385.656-.094.303-.159.7-.196 1.192-.04.49-.056 1.09-.056 1.799 0 .756.025 1.367.077 1.834.049.467.13.826.238 1.085.107.259.242.432.406.518.163.089.352.135.567.135.177 0 .343-.03.497-.09.154-.061.287-.183.399-.365.114-.182.203-.438.266-.77.065-.331.098-.767.098-1.309h2.014c0 .54-.043 1.055-.127 1.54-.083.486-.242.91-.469 1.274-.23.362-.55.647-.965.852-.416.205-.955.31-1.618.31-.753 0-1.358-.123-1.803-.364C1.203 9.82.86 9.47.62 9.011.385 8.554.23 8.008.16 7.373.092 6.741.055 6.04.055 5.276c0-.756.037-1.454.105-2.093.07-.637.226-1.188.462-1.645.24-.455.58-.815 1.029-1.071C2.096.212 2.7.082 3.454.082c.722 0 1.286.116 1.701.35.416.233.726.53.93.889.202.359.335.746.384 1.162.051.415.077.805.077 1.169H4.532c0-.735-.086-1.265-.256-1.594zM10.802 7.439c0 .233.021.445.056.634.04.192.107.353.21.483.103.133.243.236.415.31.17.073.39.113.65.113.31 0 .585-.1.832-.301.245-.201.371-.514.371-.931 0-.224-.033-.418-.09-.581-.062-.164-.162-.31-.302-.439-.142-.133-.327-.25-.553-.357-.226-.107-.51-.217-.847-.329-.446-.15-.833-.315-1.162-.492-.326-.175-.6-.383-.819-.623-.22-.238-.38-.514-.483-.826-.103-.315-.154-.675-.154-1.088 0-.989.275-1.724.826-2.21C10.3.318 11.06.076 12.02.076c.448 0 .861.049 1.24.147.377.098.704.254.98.476.274.219.49.499.643.837.152.341.231.75.231 1.225v.28h-1.93c0-.476-.083-.842-.25-1.101-.167-.254-.447-.385-.84-.385-.223 0-.41.035-.56.098-.146.065-.268.152-.356.259-.089.107-.152.236-.185.376-.034.14-.049.284-.049.434 0 .31.066.567.196.777.131.212.411.406.84.58l1.554.673c.383.168.696.343.936.527.243.182.439.378.581.588.145.21.245.439.301.693.056.25.084.532.084.838 0 1.054-.306 1.822-.917 2.303-.611.48-1.463.723-2.555.723-1.139 0-1.953-.247-2.445-.742-.49-.495-.733-1.204-.733-2.128v-.406h2.016v.292zM20.759 7.663L20.803 7.663 22.287.271 24.375.271 22.079 10.267 19.489 10.267 17.195.271 19.352.271z"
                    transform="translate(5.104 16.917)"/>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
      <Typography style={{ marginTop: -50, fontFamily: 'Inter, sans-serif !important', fontStyle: 'normal !important', fontSize: '16px', }}>
        {title}
      </Typography>
      <Typography style={{ fontFamily: 'Inter, sans-serif !important', fontStyle: 'normal !important', fontSize: '12px', color: '#bababa' }}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default IconsUploadCSV;

IconsUploadCSV.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
};
