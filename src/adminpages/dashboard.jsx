// // src/adminpages/dashboard.jsx
// import React from 'react';
// import AdminSidebar from './adminsidebar';
// import { Container } from 'react-bootstrap';
// import TopNavbar from '../components/TopNavbar';
// import axios from 'axios';
// import { Api } from '../api';
// function AdminDashboard() {

//   return (
//       <div className="d-flex flex-column" style={{ height: '100vh' }}>
//         <TopNavbar />
//     <div className="d-flex">
//       <AdminSidebar />
//       <Container className="p-4">
//         <h2>Welcome, Super Admin</h2>
//         <p>This is your dashboard.</p>
//       </Container>
//     </div>
//     </div>
//   );
// }

// export default AdminDashboard;


// import React, { useEffect, useState } from 'react';
// import { Container, Row, Col, Card, Button } from 'react-bootstrap';
// import TopNavbar from '../components/TopNavbar';
// import AdminSidebar from './adminsidebar';
// import axios from 'axios';
// import { Api } from '../api';

// function AdminDashboard() {
//   const [data, setData] = useState({
//     salesman_count: 0,
//     total_orders: 0,
//     active_orders: 0,
//     daily_order_value: 0,
//   });

//   useEffect(() => {
//     axios.get(`${Api}/user/dashboarddetails`)
//       .then((res) => setData(res.data))
//       .catch((err) => console.error(err));
//   }, []);

//   const cards = [
//     {
//       title: 'Salesmen',
//       value: data.salesman_count,
//       bg: 'linear-gradient(135deg, #6D5BBA, #8D58BF)',
//     },
//     {
//       title: 'Total Orders',
//       value: data.total_orders,
//       bg: 'linear-gradient(135deg, #0081CF, #00C2BA)',
//     },
//     {
//       title: 'Active Orders',
//       value: data.active_orders,
//       bg: 'linear-gradient(135deg, #F7971E, #FFD200)',
//     },
//     {
//       title: 'Daily Order Value',
//       value: `₹ ${data.daily_order_value}`,
//       bg: 'linear-gradient(135deg, #F953C6, #B91D73)',
//     },
//   ];

//   return (
//     <div className="d-flex flex-column" style={{ height: '100vh' }}>
//       <TopNavbar />
//       <div className="d-flex">
//         <AdminSidebar />
//         <Container fluid className="p-4">
//           <h2 className="mb-3">Welcome, Super Admin</h2>
//           <p>This is your dashboard.</p>

//           <Row xs={1} sm={2} md={4} className="g-4 my-3">
//             {cards.map((card, idx) => (
//               <Col key={idx}>
//                 <Card
//                   style={{
//                     background: card.bg,
//                     color: 'white',
//                     height: '140px',
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     border: 'none',
//                     borderRadius: '16px',
//                     boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//                   }}
//                 >
//                   <Card.Body className="text-center">
//                     <Card.Title style={{ fontSize: '1.2rem' }}>{card.title}</Card.Title>
//                     <Card.Text style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>
//                       {card.value}
//                     </Card.Text>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))}
//           </Row>

//           <Button variant="outline-dark">Clean Data</Button>
//         </Container>
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;




import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import TopNavbar from '../components/TopNavbar';
import AdminSidebar from './adminsidebar';
import axios from 'axios';
import { Api } from '../api';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#f70707ff', '#06fa0aff'];

function AdminDashboard() {
  const [data, setData] = useState({
    salesman_count: 0,
    total_orders: 0,
    active_orders: 0,
    total_order_value: 0,
    today_order_value: 0,
    today_recived_value: 0,
    total_recived_value: 0,
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    axios.get(`${Api}/user/dashboarddetails`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));

    axios.get(`${Api}/user/order_amount_data`)
    .then(res => {
      const lastSix = res.data.slice(-6).map(item => ({
        date: item.timestamp,
        value: parseFloat(item.today_order_value)
      }));
      setChartData(lastSix);
    })
    .catch(err => console.error(err));
  }, []);
console.log(chartData)

  const pieData = [
    { name: 'Total Amount', value: data.total_order_value },
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

  return (
    <div className="d-flex flex-column" style={{ height: '100vh' }}>
      <TopNavbar />
      <div className="d-flex">
        <AdminSidebar />
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
                  <Card.Text style={{fontSize: '1rem', textAlign: 'left'}}>Active Salesmens</Card.Text>
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
                <h5 className="mb-3 text-center">Active Order Ratio</h5>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
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
        </Container>
      </div>
    </div>
  );
}

export default AdminDashboard;
