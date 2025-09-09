// import { Navbar, Container, Dropdown } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import logo from '../assets/logo.png';

// function TopNavbar() {
//   const navigate = useNavigate();
//   const login_name = localStorage.getItem('login_name') || 'User';
//   const firstLetter = login_name.charAt(0).toUpperCase();

//   const handleLogout = () => {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//     localStorage.removeItem('login_name');
//     navigate('/');
//   };

//   return (
//     <Navbar bg="dark" variant="dark" className="px-4 py-2 shadow">
//       <Container fluid className="d-flex justify-content-between align-items-center">
//         <Navbar.Brand onClick={() => navigate('/admin/dashboard')} style={{ cursor: 'pointer' }}>
//           <img src={logo} alt="logo" width="80px" />
//         </Navbar.Brand>

//         <Dropdown align="end">
//           <Dropdown.Toggle
//             as="div"
//             style={{
//               borderRadius: '50%',
//               width: '40px',
//               height: '40px',
//               textAlign: 'center',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               lineHeight: '40px',
//               backgroundColor: '#6c757d',
//               color: '#fff',
//               cursor: 'pointer',
//               userSelect: 'none'
//             }}
//           >
//             {firstLetter}
//           </Dropdown.Toggle>

//           <Dropdown.Menu>
//             <Dropdown.Header>{login_name}</Dropdown.Header>
//             <Dropdown.Divider />
//             <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
//           </Dropdown.Menu>
//         </Dropdown>
//       </Container>
//     </Navbar>
//   );
// }

// export default TopNavbar;


import { Navbar, Container, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './navbar.css'

function TopNavbar() {
  const navigate = useNavigate();
  const login_name = localStorage.getItem('login_name') || 'User';
  const firstLetter = login_name.charAt(0).toUpperCase();
  const usertype = localStorage.getItem('user_type')

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('login_name');
    navigate('/');
  };

  const navigationdashboard = () => {
    if (usertype === 'SuperAdmin') {
        navigate('/admin/dashboard');
      } else if (usertype === 'Sales Person') {
        navigate('/salesman/dashboard');
      } else {
        console.error('Unknown user type!');
      }
  }

  return (
    <Navbar bg="dark" variant="dark" className="px-4 py-2 shadow">
      <Container fluid className="d-flex justify-content-between align-items-center">
        <div onClick={() => navigationdashboard()} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="logo" style={{ height: '50px' }} />
        </div>

        <Dropdown align="end">
          <Dropdown.Toggle
            as="div"
            id="profile-dropdown"
            style={{
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              lineHeight: '40px',
              backgroundColor: '#0684f3ff',
              color: '#fff',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            {firstLetter}
          </Dropdown.Toggle>

          <Dropdown.Menu className="mt-2">
            <Dropdown.Header className="text-center">{login_name}</Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout} className="text-danger">
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;
