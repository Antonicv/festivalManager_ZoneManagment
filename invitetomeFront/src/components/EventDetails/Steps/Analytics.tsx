import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleIcon from '@mui/icons-material/People';
import HowToRegIcon from '@mui/icons-material/HowToReg';

// Sample data types
interface ChartDataPoint {
  name: string;
  value: number;
}

interface TimelineDataPoint {
  name: string;
  sent: number;
  opened: number;
  responded: number;
}

interface QuotaDataPoint extends ChartDataPoint {
  color: string;
}

const quotaDistribution: QuotaDataPoint[] = [
  { name: 'GENERAL', value: 250, color: '#2196f3' },
  { name: 'VIP', value: 100, color: '#f50057' },
  { name: 'COMPROMIS', value: 80, color: '#9c27b0' },
  { name: 'BACKSTAGE', value: 20, color: '#ff9800' },
];

const timelineData: TimelineDataPoint[] = [
  { name: 'Week 1', sent: 100, opened: 80, responded: 60 },
  { name: 'Week 2', sent: 200, opened: 160, responded: 120 },
  { name: 'Week 3', sent: 350, opened: 280, responded: 220 },
  { name: 'Week 4', sent: 450, opened: 380, responded: 320 },
];

export const Analytics = () => {
  const [sending, setSending] = useState(false);
  const totalInvitations = 500;
  const sentInvitations = 450;
  const progress = (sentInvitations / totalInvitations) * 100;

  const handleSendInvitations = () => {
    setSending(true);
    // Simulate sending process
    setTimeout(() => {
      setSending(false);
    }, 2000);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', pt: 2 }}>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Invitations</Typography>
              </Box>
              <Typography variant="h4">{sentInvitations}/{totalInvitations}</Typography>
              <LinearProgress variant="determinate" value={progress} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Opened</Typography>
              </Box>
              <Typography variant="h4">380</Typography>
              <Typography variant="body2" color="text.secondary">
                84% open rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Responded</Typography>
              </Box>
              <Typography variant="h4">320</Typography>
              <Typography variant="body2" color="text.secondary">
                71% response rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HowToRegIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Checked In</Typography>
              </Box>
              <Typography variant="h4">280</Typography>
              <Typography variant="body2" color="text.secondary">
                62% attendance rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Invitation Progress Timeline
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={timelineData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sent" fill="#2196f3" name="Sent" />
                  <Bar dataKey="opened" fill="#4caf50" name="Opened" />
                  <Bar dataKey="responded" fill="#ff9800" name="Responded" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quota Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={quotaDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {quotaDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Send Invitations Button */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={sending ? <CircularProgress size={20} color="inherit" /> : <EmailIcon />}
          onClick={handleSendInvitations}
          disabled={sending}
          sx={{ px: 4, py: 1.5 }}
        >
          {sending ? 'Sending...' : 'Send Remaining Invitations'}
        </Button>
      </Box>
    </Box>
  );
};

export default Analytics;
