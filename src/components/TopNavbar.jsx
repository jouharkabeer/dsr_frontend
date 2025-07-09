import { Navbar, Container, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

function TopNavbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';
  const firstLetter = username.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" className="px-4 py-2 shadow">
      <Container fluid className="d-flex justify-content-between align-items-center">
        <Navbar.Brand onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="logo" width="100px" />
        </Navbar.Brand>

        <Dropdown align="end">
          <Dropdown.Toggle
            variant="light"
            id="dropdown-user"
            style={{
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              padding: 0,
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              lineHeight: '40px',
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 'none'
            }}
          >
            {firstLetter}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Header>{username}</Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;
