import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import TopNavbar from '../components/TopNavbar';
import Salesmansidebar from './salesmansidebar'
import axios from 'axios';
import { Api } from '../api';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#f70707ff', '#06fa0aff'];

function SalesmanDashboard() {
  const [data, setData] = useState({
  active_orders: 0,
  total_due_value: 0,
  total_order_value: 0,
  total_orders: 0
  });
  const [chartData, setChartData] = useState([]);
  const [orderchartData, setOrderchartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


 const fetchDashboard = async () => {
  const sid = localStorage.getItem('user_id');
  setLoading(true);
  try {
    const url = `${Api}/user/dashboarddetails/bysalesman/${sid}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    setData(res.data);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const fetchData = async () => {
    Tokenvaliditychecker();
    await fetchDashboard();
  };
  fetchData(); // ✅ Call it here
}, []);



const Tokenvaliditychecker = async () => {
  try {
    const res = await axios.get(`${Api}/user/validity/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    const data = res.data;


    if (data.message === 'its a valid token') {
      // Do nothing (this replaces `pass`)
    }
  } catch (err) {
    navigate('/'); // Redirect to login or home if token is invalid
  }
};




  const pieData = [
    { name: 'Pending Amount', value: data.total_due_value},
    { name: 'Recieved Amount', value: data.total_order_value - data.total_due_value },
  ];

  const cardStyle = {
    // background: 'linear-gradient(135deg, #43CBFF 0%, #9708CC 100%)',
    color: 'black',
    borderRadius: '12px',
    height: '185px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  };
const username_lg = localStorage.getItem('login_name')
  return (
    <div className="d-flex flex-column" style={{ height: '100vh' }}>
      <TopNavbar />
      <div className="d-flex">
        <Salesmansidebar />
        {loading ? <Loader/> : 
        <Container fluid className="p-4">
          <h4 className="mb-4">Welcome, {username_lg}</h4>

          <Row>
            <Col md={6}>
            <Row>
                          <Col className="mb-3">
              <Card style={cardStyle}>
              <Card.Body style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Card.Text style={{ fontSize: '1rem', textAlign: 'left' }}>
                  Total Orders
                </Card.Text>
                <Card.Text
                  style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    textAlign: 'right',
                    marginTop: 'auto' // pushes it to the bottom
                  }}
                >
                  {data.total_orders}
                </Card.Text>
              </Card.Body>

              </Card>
            </Col>
            </Row>
            <Row>
                          <Col className="mb-3">
              <Card style={cardStyle}>
               <Card.Body style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Card.Text style={{ fontSize: '1rem', textAlign: 'left' }}>
                  Active Orders
                </Card.Text>
                <Card.Text
                  style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    textAlign: 'right',
                    marginTop: 'auto' // pushes it to the bottom
                  }}
                >
                  {data.active_orders}
                </Card.Text>
              </Card.Body>
              </Card>
            </Col>
            </Row>
            </Col>
            <Col md={6} className="mb-4">
              <Card style={{ borderRadius: '12px', padding: '20px', 
              boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
              backgroundColor: "#fff", }}>
                <h5 className="mb-3 text-center">Payment Details</h5>
                <ResponsiveContainer width="100%" height={300} style={{boxShadow:10}}>
                  
                  <PieChart>
                    <Tooltip/>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      rootTabIndex={10}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </Container>}
      </div>
    </div>
  );
}

export default SalesmanDashboard;
