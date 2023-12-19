import { AspectRatio } from "@mui/joy";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Tooltip,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { formatDateOrString, formatNumber } from "../../../utils/format";
import { useSelector } from "react-redux";

const TypographyStyle = styled(Typography)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* 
  layout: 4
  xs: 
  sm:
  md: 
  lg:
*/

const VideoPreview = ({ project, layout }) => {
  const theme = useTheme();
  const matchUp = useMediaQuery(theme.breakpoints.up('md'));

  const navigate = useNavigate();

  const isSearchLayout = matchUp && layout.lg === 12;

  return (
    <Grid item xs={layout.xs} sm={layout.sm} lg={layout.lg}>
      <Card
        sx={{
          m: 1,
          borderRadius: 3,
          cursor: "pointer",
          bgcolor: "unset",
          boxShadow: "unset",
        }}
        onClick={() => navigate(`/projects/${project.id}`)}
      >
        <Grid container>
          <Grid item xs={isSearchLayout ? 3.5 : 12}>
            <AspectRatio
              ratio="16/9"
              sx={{
                width: "100%",
                "& .MuiAspectRatio-content": {
                  bgcolor: "inherit",
                },
              }}
            >
              <CardMedia
                component="img"
                image={project.thumbnail}
                sx={{ borderRadius: 3, objectFit: "cover" }}
              />
            </AspectRatio>
          </Grid>
          <Grid item xs={isSearchLayout ? 8.5 : 12}>
            <CardContent sx={{ 
              px: isSearchLayout ? 1 : 0, 
              py: isSearchLayout ? 0 : 1, 
              pb: 1, 
              bgcolor: "unset" 
            }}>
              <Grid 
                container 
                sx={{
                  flexDirection: isSearchLayout ? "column-reverse" : 'unset'
                }}
              >
                <Grid 
                  item 
                  xs={isSearchLayout ? 8 : 1.5}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: isSearchLayout ? 'center' : 'flex-start'
                  }}
                >
                  <Avatar
                    alt="avatar"
                    src={project.student.avatar || ""}
                    sx={{ margin: 0.5 }}
                  />

                  { isSearchLayout && (
                    <Typography sx={{ fontFamily: "JetBrains Mono" }}>
                      {project.student.fullname}
                    </Typography>
                  ) }
                </Grid>
                { isSearchLayout && (
                  <Grid 
                    item
                    xs={6}
                  >
                    <TypographyStyle
                      variant="subtitle2"
                      component="div"
                      textAlign={"justify"}
                      sx={{ p: 1 }}
                    >
                      <Tooltip title='Thông tin trong phần mô tả dự án'>
                        <Chip label={project.description.techs.map(tech => tech.name).join(', ')} size="small"/>
                      </Tooltip>
                    </TypographyStyle>
                  </Grid>                  
                ) }
                <Grid 
                  item 
                  xs={isSearchLayout ? 8 : 10.5}
                >
                  <Box sx={{ px: 1 }}>
                    <Tooltip title={project.title}>
                      <TypographyStyle
                        variant="subtitle2"
                        component="div"
                        textAlign={"justify"}
                        sx={{ font: "normal 500 1rem 'JetBrains Mono'", mb: 1 }}
                      >
                        {project.title}
                      </TypographyStyle>
                    </Tooltip>
                    { !isSearchLayout && (
                      <Typography sx={{ fontFamily: "JetBrains Mono" }}>
                        {project.student.fullname}
                      </Typography>
                    ) }
                    <Typography sx={{ fontFamily: "JetBrains Mono" }}>
                      {formatNumber(project.description.view) + " lượt xem"} • {formatDateOrString(project.description.create_at)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};

export default VideoPreview;
