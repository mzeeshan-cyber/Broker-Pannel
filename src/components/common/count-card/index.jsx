import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import Box from '@mui/material/Box';

export default function CountCard({ title, color, iconPrimary, count = 0 }) {
  return (
    <MainCard
      sx={{
        borderRadius: 2,
        boxShadow: '0px 6px 20px rgba(0,0,0,0.08)',
        transition: '0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
        }
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            variant="rounded"
            color={color}
            sx={{ width: 48, height: 48, fontSize: 26 }}
          >
            {iconPrimary}
          </Avatar>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Trips
            </Typography>
          </Box>
        </Stack>

        <Typography variant="h4" sx={{ fontWeight: 700, color: (theme) => theme.palette[color].main }}>
          {count}
        </Typography>
      </Stack>
    </MainCard>
  );
}
