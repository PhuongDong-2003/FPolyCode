import { Accordion, AccordionDetails, AccordionSummary, Typography, styled } from '@mui/material';
import React, { Fragment, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AccordionSummaryStyle = styled(AccordionSummary)(({theme}) => ({
  backgroundColor: '#E5E5E5'
}))

const Support = () => {
  window.scrollTo(0, 0);

  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Fragment>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummaryStyle
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Chuyển đổi mail trường thành mail cá nhân
          </Typography>
        </AccordionSummaryStyle>
        <AccordionDetails>
          <Typography>
            Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
            Aliquam eget maximus est, id dignissim quam. Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus,
            varius pulvinar diam eros in elit. Pellentesque convallis laoreet
            laoreet.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummaryStyle
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Cách để lấy lại mật khẩu email FPT
          </Typography>
        </AccordionSummaryStyle>
        <AccordionDetails>
          <Typography>
            Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus,
            varius pulvinar diam eros in elit. Pellentesque convallis laoreet
            laoreet.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummaryStyle
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Hướng dẫn sử dụng website
          </Typography>
        </AccordionSummaryStyle>
        <AccordionDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
            amet egestas eros, vitae egestas augue. Duis vel est augue. Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus,
            varius pulvinar diam eros in elit. Pellentesque convallis laoreet
            laoreet.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummaryStyle
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>Thông tin liên hệ hỗ trợ</Typography>
        </AccordionSummaryStyle>
        <AccordionDetails>
          <Typography>
            Số điện thoại liên hệ giải đáp thắc mắc ý kiến sinh viên: 02873088800
          </Typography>
          <Typography>
            Địa chỉ email phòng ban kĩ thuật IT: kithuat.fplhcm@fe.edu.vn
          </Typography>
          <Typography>
            Văn phòng kỹ thuật IT: 778/B1 Nguyễn Kiệm, P.4, Q. Phú Nhuận, TP. Hồ Chí Minh.
          </Typography>
        </AccordionDetails>
      </Accordion>  
    </Fragment>
  )
}

export default Support