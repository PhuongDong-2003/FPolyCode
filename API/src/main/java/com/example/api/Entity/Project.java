package com.example.api.Entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "Projects")
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private UUID id;

    @Column(name = "title", columnDefinition = "nvarchar(255)", nullable = false)
    private String title;

    @Column(name = "status")
    private String status;

    @Column(name = "isPublic", nullable = false)
    private Boolean isPublic;

    @Column(name = "videoPath", nullable = false)
    private String videoPath;

    @Column(name = "sourcePath", nullable = false)
    private String sourcePath;

    @Column(name = "thumbnail", nullable = false)
    private String thumbnailPath;

    @OneToOne(cascade = CascadeType.ALL)
    private Description description;

    @OneToOne(mappedBy = "project", cascade = CascadeType.ALL)
    private Feedback feedback;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    @ManyToOne
    @JoinColumn(name = "censor_id")
    private User censor;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "tech_project", joinColumns = @JoinColumn(name = "project_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "tech_id", referencedColumnName = "id"))
    private Set<Tech> techs = new HashSet<>();


    public void addTech(Tech tech) {
        if (!techs.contains(tech)) {
            techs.add(tech);
        }
    }
}
