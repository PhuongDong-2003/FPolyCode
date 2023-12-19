import { Grid } from "@mui/material";
import React from "react";
import VideoPreview from "../../components/video/VideoPreview";
import { useGetProjectsQuery } from "../../api/project.api";
import { useLocation } from "react-router-dom";

const layout = {
  xs: 12,
  sm: 12,
  lg: 12,
};

const Search = () => {
  const location = useLocation();
  const search = location.state?.search || "";
  console.log(search)
  const { data: projectsData } = useGetProjectsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });
  const projects = projectsData?.data || [];

  return (
    <Grid container>
      {projects
        .filter(
          (project) =>
            project.title.includes(search) ||
            project.student.fullname.includes(search) ||
            project.major.name.includes(search)
        )
        .map((project) => (
          <VideoPreview key={project.id} project={project} layout={layout} />
        ))}
    </Grid>
  );
};

export default Search;
