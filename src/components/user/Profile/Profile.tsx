import {
  Box,
  Breadcrumbs,
  Link,
  Typography,
  useTheme,
  Avatar,
  Stack,
  Divider,
  Chip,
  Paper,
  Skeleton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { UseAuth } from '../../../context/AuthContext';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VerifiedIcon from '@mui/icons-material/Verified';
import PendingIcon from '@mui/icons-material/Pending';

export default function Profile() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { fillData } = UseAuth();

  // Optional: fallback if not loaded yet
  if (!fillData) {
    return (
      <Box sx={{ p: 5, textAlign: 'center' }}>
        <Typography>Loading profile...</Typography>
      </Box>
    );
  }

  const {
    userName,
    email,
    phoneNumber,
    country,
    profileImage,
    role,
    verified,
    createdAt,
  } = fillData;

  const joinedDate = new Date(createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
    {!fillData ? (
  // Skeleton Loader
  <Box sx={{ p: { xs: 2, md: 5 }, mt: 3 }}>
    <Typography
      sx={{
        textAlign: 'center',
        color: theme.palette.text.primary,
        fontSize: '28px',
        fontWeight: 600,
        mb: 2,
      }}
    >
      {t('user.myProfile')}
    </Typography>

    <Breadcrumbs maxItems={2} aria-label="breadcrumb" sx={{ mb: 4 }}>
      <Link component={RouterLink} underline="hover" color="inherit" to="/">
        {t('user.home')}
      </Link>
      <Typography color="text.disabled" fontWeight={600}>
        {t('user.myProfile')}
      </Typography>
    </Breadcrumbs>

    <Paper
      elevation={3}
      sx={{
        maxWidth: 600,
        mx: 'auto',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      {/* Gradient Header Skeleton */}
      <Skeleton variant="rectangular" height={140} />

      <Stack alignItems="center" sx={{ mt: -8, px: 4, pb: 4 }}>
        {/* Avatar Skeleton */}
        <Skeleton variant="circular" width={120} height={120} />

        {/* Name & Role */}
        <Skeleton variant="text" width={200} height={40} sx={{ mt: 2 }} />
        <Skeleton variant="text" width={100} height={28} sx={{ mt: 1 }} />

        {/* Verified Status */}
        <Skeleton variant="text" width={140} height={24} sx={{ mt: 2 }} />

        <Divider sx={{ my: 3, width: '100%' }} />

        {/* Details List Skeleton */}
        <Stack spacing={3} sx={{ width: '100%' }}>
          {[1, 2, 3, 4].map((i) => (
            <Stack key={i} direction="row" alignItems="center" gap={2}>
              <Skeleton variant="circular" width={40} height={40} />
              <Stack sx={{ flex: 1 }}>
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="text" width="70%" height={28} sx={{ mt: 0.5 }} />
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Paper>
  </Box>
) : (
  // Real Profile Content (your existing code)
<Box sx={{ p: { xs: 2, md: 5 }, mt: 3 }}>
        <Typography
          sx={{
            textAlign: 'center',
            color: theme.palette.text.primary,
            fontSize: '28px',
            fontWeight: 600,
            mb: 2,
          }}
        >
          {t('user.myProfile')}
        </Typography>

        <Breadcrumbs maxItems={2} aria-label="breadcrumb" sx={{ mb: 4 }}>
          <Link component={RouterLink} underline="hover" color="inherit" to="/">
            {t('user.home')}
          </Link>
          <Typography color="text.disabled" fontWeight={600}>
            {t('user.myProfile')}
          </Typography>
        </Breadcrumbs>

        {/* Profile Card */}
        <Paper
          elevation={3}
          sx={{
            maxWidth: 600,
            mx: 'auto',
            borderRadius: 3,
            overflow: 'hidden',
            background: theme.palette.background.paper,
          }}
        >
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              height: 140,
            }}
          />

          <Stack alignItems="center" sx={{ mt: -8, px: 4, pb: 4 }}>
            <Avatar
              src={profileImage}
              alt={userName}
              sx={{
                width: 120,
                height: 120,
                border: `6px solid ${theme.palette.background.paper}`,
                boxShadow: 3,
              }}
            >
              {userName?.[0]?.toUpperCase()}
            </Avatar>

            <Typography variant="h5" fontWeight={600} mt={2}>
              {userName}
            </Typography>

            <Chip
              label={role === 'user' ? t('user.roleUser') : role}
              color="primary"
              size="small"
              sx={{ mt: 1, mb: 2 }}
            />

            <Stack direction="row" alignItems="center" gap={1} color="text.secondary">
              {verified ? (
                <>
                  <VerifiedIcon color="primary" fontSize="small" />
                  <Typography variant="body2">{t('user.verified')}</Typography>
                </>
              ) : (
                <>
                  <PendingIcon fontSize="small" />
                  <Typography variant="body2">{t('user.notVerified')}</Typography>
                </>
              )}
            </Stack>

            <Divider sx={{ my: 3, width: '100%' }} />

            {/* Details */}
            <Stack spacing={2} sx={{ width: '100%' }}>
              <Stack direction="row" alignItems="center" gap={2}>
                <EmailIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('user.email')}
                  </Typography>
                  <Typography variant="body1">{email}</Typography>
                </Box>
              </Stack>

              {phoneNumber && (
                <Stack direction="row" alignItems="center" gap={2}>
                  <PhoneIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('user.phone')}
                    </Typography>
                    <Typography variant="body1" dir="ltr">
                      {phoneNumber}
                    </Typography>
                  </Box>
                </Stack>
              )}

              {country && (
                <Stack direction="row" alignItems="center" gap={2}>
                  <LocationOnIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('user.country')}
                    </Typography>
                    <Typography variant="body1" textTransform="capitalize">
                      {country}
                    </Typography>
                  </Box>
                </Stack>
              )}

              <Stack direction="row" alignItems="center" gap={2}>
                <CalendarMonthIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('user.joined')}
                  </Typography>
                  <Typography variant="body1">{joinedDate}</Typography>
                </Box>
              </Stack>
            </Stack>
          </Stack>
        </Paper>
      </Box>
)}
      
    </>
  );
}