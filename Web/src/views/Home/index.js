import React from "react";
import { Grid } from "@mui/material";
import VideoPreview from "../../components/video/VideoPreview";
import { useGetProjectsQuery } from "../../api/project.api";
import { isNull, omitBy } from "lodash";

const layout = {
  xs: 12,
  sm: 6,
  lg: 4,
};

const Home = () => {
  const { data: projectsData } = useGetProjectsQuery();
  const projects = projectsData?.data || [];

  return (
    <Grid container>
      {projects.map((project) => (
        <VideoPreview key={project.id} project={project} layout={layout} />
      ))}
    </Grid>
  );
};

export default Home;
