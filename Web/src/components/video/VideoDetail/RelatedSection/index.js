import {
  Box,
  Card,
  CardMedia,
  Stack,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDateOrString, formatNumber } from "../../../../utils/format";
import { APPROVE_STATUS } from "../../../../utils/consts";
import { useGetProjectsQuery } from "../../../../api/project.api";

const TypographyStyle = styled(Typography)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RelatedSection = ({ except }) => {
  const navigate = useNavigate();

  const { data: projectsRelated } = useGetProjectsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      data: data?.data.filter((product) => product.id !== except) || [],
    }),
  });

  const projects = projectsRelated;

  return (
    <Box>
      <Stack
        direction={"column"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        spacing={1}
      >
        {projects.map((project) => (
          <Card
            key={project.id}
            sx={{
              display: "flex",
              width: "100%",
              height: 100,
              cursor: "pointer",
              borderRadius: 3,
              bgcolor: "unset",
              boxShadow: "unset",
            }}
            onClick={() =>
              navigate(`/projects/${project.id}`, { state: project.id })
            }
          >
            <Box sx={{ maxWidth: "225px" }}>
              <CardMedia
                component="img"
                image={project.thumbnail}
                sx={{
                  width: "175px",
                  height: "100%",
                  borderRadius: 3,
                  objectFit: "fill",
                }}
              />
            </Box>
            <Box
              sx={{
                px: 1,
                py: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              <Tooltip title={project.name}>
                <TypographyStyle variant="subtitle2" component="div">
                  {project.title}
                </TypographyStyle>
              </Tooltip>
              <TypographyStyle variant="subtitle2" component="div">
                {project.student.fullname}
              </TypographyStyle>
              <TypographyStyle variant="subtitle2" component="div">
                {formatNumber(project.description.view) + " lượt xem"} •{" "}
                {formatDateOrString(project.description.create_at)}
              </TypographyStyle>
            </Box>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default RelatedSection;
