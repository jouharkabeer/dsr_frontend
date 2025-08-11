import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import TopNavbar from '../components/TopNavbar';
import AdminSidebar from './adminsidebar';
import axios from 'axios';
import { Api } from '../api';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#f70707ff', '#06fa0aff'];

function AdminDashboard() {
  const [data, setData] = useState({
    salesman_count: 0,
    total_orders: 0,
    active_orders: 0,
    total_order_value: 0,
    daily_order_value: 0,
    today_recived_value: 0,
    total_recived_value: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [orderchartData, setOrderchartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  // useEffect(() => {
  //   Tokenvaliditychecker()
  //   setLoading(true)
  //   axios.get(`${Api}/user/dashboarddetails`)
  //     .then(res => setData(res.data))
  //     .catch(err => console.error(err));

  //   axios.get(`${Api}/user/order_amount_data`)
  //   .then(res => {
  //     const lastSix = res.data.slice(-6).map(item => ({
  //       date: item.timestamp,
  //       value: parseFloat(item.today_order_value)
  //     }));
  //     setChartData(lastSix);

  //     setLoading(false)
  //   })
  //   .catch(err => console.error(err));

  //   axios.get(`${Api}/user/order_chart_data`)
  //   .then(res => {
  //     const lastSix = res.data.slice(-6).map(item => ({
  //       date: item.timestamp,
  //       value: parseFloat(item.today_order_value)
  //     }));
  //     setOrderchartData(lastSix);

  //     setLoading(false)
  //   })
  //   .catch(err => console.error(err));
  // }, []);

  useEffect(() => {
  const fetchData = async () => {
    try {
      Tokenvaliditychecker();

      setLoading(true);

      const headers = {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      };

      const [dashboardRes, orderAmountRes, orderChartRes] = await Promise.all([
        axios.get(`${Api}/user/dashboarddetails`, { headers }),
        axios.get(`${Api}/user/order_amount_data`, { headers }),
        axios.get(`${Api}/user/order_chart_data`, { headers }),
      ]);

      setData(dashboardRes.data);

      const lastSixAmount = orderAmountRes.data.slice(-6).map(item => ({
        date: item.timestamp,
        value: parseFloat(item.today_order_value),
      }));
      setChartData(lastSixAmount);

      const lastSixChart = orderChartRes.data.slice(-6).map(item => ({
        date: item.timestamp,
        value: parseFloat(item.today_order_value),
      }));
      setOrderchartData(lastSixChart);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


const Tokenvaliditychecker = async () => {
  try {
    const res = await axios.get(`${Api}/user/validity/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    const data = res.data;
    console.log(data);

    if (data.message === 'its a valid token') {
      // Do nothing (this replaces `pass`)
    }
  } catch (err) {
    navigate('/'); // Redirect to login or home if token is invalid
  }
};




  const pieData = [
    { name: 'Pending Amount', value: data.total_order_value - data.total_recived_value },
    { name: 'Recieved Amount', value: data.total_recived_value },
  ];

  const cardStyle = {
    // background: 'linear-gradient(135deg, #43CBFF 0%, #9708CC 100%)',
    color: 'black',
    borderRadius: '12px',
    height: '120px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  };
console.log(data)
  return (
    <div className="d-flex flex-column" style={{ height: '100vh' }}>
      <TopNavbar />
      <div className="d-flex">
        <AdminSidebar />
        {loading ? <Loader/> : 
        <Container fluid className="p-4">
          <h4 className="mb-4">Welcome, Super Admin</h4>

          {/* Summary Cards */}
          <Row className="mb-4" xs={1} sm={2} md={3}>
            <Col className="mb-3">
              <Card style={cardStyle}>
                <Card.Body>
                  <Card.Text style={{fontSize: '1 rem', textAlign: 'left'}}>Total Orders</Card.Text>
                  <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'right' }}>
                    {data.active_orders}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col className="mb-3">
              <Card style={cardStyle}>
                <Card.Body>
                  <Card.Text style={{fontSize: '1rem', textAlign: 'left'}}>Today Order Value</Card.Text>
                  <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'right' }}>
                    ₹ {data.daily_order_value}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col className="mb-3">
              <Card style={cardStyle}>
                <Card.Body>
                  <Card.Text style={{fontSize: '1rem', textAlign: 'left'}}>Active Salesmans</Card.Text>
                  <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'right' }}>
                    {data.salesman_count}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Charts */}
          <Row>
            <Col md={8} className="mb-4">



              <Card style={{ borderRadius: '12px', padding: '20px' }}>
  <h5 className="mb-3">Daily Order Progress (Last 6 Days)</h5>
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={chartData}>
      <YAxis />
      <XAxis dataKey="date" />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#00C49F"
        strokeWidth={3}
        activeDot={{ r: 6 }}
      />
    </LineChart>
  </ResponsiveContainer>
</Card>





            </Col>

            <Col md={4} className="mb-4">
              <Card style={{ borderRadius: '12px', padding: '20px' }}>
                <h5 className="mb-3 text-center">Payment Details</h5>
                <ResponsiveContainer width="100%" height={300}>
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
                        <Card style={{ borderRadius: '12px', padding: '20px' }}>
  <h5 className="mb-3">Daily Order Progress (Last 6 Days)</h5>
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={orderchartData}>
      <YAxis />
      <XAxis dataKey="date" />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#00C49F"
        strokeWidth={3}
        activeDot={{ r: 6 }}
      />
    </LineChart>
  </ResponsiveContainer>
</Card>
        </Container>}
      </div>
    </div>
  );
}

export default AdminDashboard;
