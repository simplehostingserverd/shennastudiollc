'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Logout,
  TrendingUp,
  Link as LinkIcon,
  Visibility,
} from '@mui/icons-material'

interface AffiliateLink {
  id: string
  title: string
  url: string
  description: string | null
  placement: string
  isActive: boolean
  clicks: number
  createdAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [affiliates, setAffiliates] = useState<AffiliateLink[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    placement: 'sidebar',
    isActive: true,
  })

  useEffect(() => {
    checkAuth()
    fetchAffiliates()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/session')
      if (!response.ok) {
        router.push('/admin/login')
      }
    } catch (error) {
      router.push('/admin/login')
    }
  }

  const fetchAffiliates = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/affiliates')
      const data = await response.json()
      setAffiliates(data.affiliates || [])
    } catch (error) {
      console.error('Error fetching affiliates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const url = editingId
        ? `/api/admin/affiliates/${editingId}`
        : '/api/admin/affiliates'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setOpenDialog(false)
        setEditingId(null)
        setFormData({
          title: '',
          url: '',
          description: '',
          placement: 'sidebar',
          isActive: true,
        })
        fetchAffiliates()
      }
    } catch (error) {
      console.error('Error saving affiliate:', error)
    }
  }

  const handleEdit = (affiliate: AffiliateLink) => {
    setFormData({
      title: affiliate.title,
      url: affiliate.url,
      description: affiliate.description || '',
      placement: affiliate.placement,
      isActive: affiliate.isActive,
    })
    setEditingId(affiliate.id)
    setOpenDialog(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this affiliate link?')) return

    try {
      const response = await fetch(`/api/admin/affiliates/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchAffiliates()
      }
    } catch (error) {
      console.error('Error deleting affiliate:', error)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const totalClicks = affiliates.reduce((sum, aff) => sum + aff.clicks, 0)
  const activeLinks = affiliates.filter((aff) => aff.isActive).length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage affiliate links and track performance
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{ height: 'fit-content' }}
          >
            Logout
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LinkIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {affiliates.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Links
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Visibility sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {activeLinks}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Links
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {totalClicks}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Clicks
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              Affiliate Links
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setOpenDialog(true)
                setEditingId(null)
                setFormData({
                  title: '',
                  url: '',
                  description: '',
                  placement: 'sidebar',
                  isActive: true,
                })
              }}
            >
              Add New Link
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : affiliates.length === 0 ? (
            <Alert severity="info">
              No affiliate links yet. Click "Add New Link" to create one.
            </Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Title</strong></TableCell>
                    <TableCell><strong>Placement</strong></TableCell>
                    <TableCell><strong>Clicks</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell align="right"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {affiliates.map((affiliate) => (
                    <TableRow key={affiliate.id} hover>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          {affiliate.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                          {affiliate.url}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={affiliate.placement} size="small" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          {affiliate.clicks}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={affiliate.isActive ? 'Active' : 'Inactive'}
                          color={affiliate.isActive ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(affiliate)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(affiliate.id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editingId ? 'Edit Affiliate Link' : 'Create New Affiliate Link'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />

              <TextField
                fullWidth
                label="Affiliate URL"
                type="url"
                required
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
              />

              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <FormControl fullWidth>
                <InputLabel>Placement</InputLabel>
                <Select
                  value={formData.placement}
                  label="Placement"
                  onChange={(e) =>
                    setFormData({ ...formData, placement: e.target.value })
                  }
                >
                  <MenuItem value="sidebar">Sidebar</MenuItem>
                  <MenuItem value="footer">Footer</MenuItem>
                  <MenuItem value="product-page">Product Page</MenuItem>
                  <MenuItem value="homepage">Homepage</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                  />
                }
                label="Active"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingId ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}
