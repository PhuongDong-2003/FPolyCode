package com.example.api.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Descriptions")
@Builder
public class Description {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "create_date", nullable = false)
    private Date createDate;

    @Column(name = "approval_date")
    private Date approvalDate;

    @Column(name = "github")
    private String github;

    @Column(name = "viewCount")
    private Integer viewCount;

    @Column(name = "likeCount")
    private Integer likeCount;

    @JsonIgnore
    @OneToOne(mappedBy = "description")
    @JoinColumn(name = "project_id")
    private Project project;

}
