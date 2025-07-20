// import "./loading.css";
// import loaderimg from '../assets/loader-logo.png'
// export default function Loader() {
//   return (
//     <div className="App">
//       <h1>React Icon Spinner</h1>
//       <br />
//       <img src={loaderimg} className="loading"/>
//       <span>Please Wait...</span>
//     </div>
//   );
// }

import "./loading.css";
import loaderimg from '../assets/loader-logo.png';

export default function Loader() {
  return (
    <div className="loader-wrapper">
      <div className="loader-content">
        <img src={loaderimg} className="loading" alt="Loading..." />
        <span>Please Wait...</span>
      </div>
    </div>
  );
}
