package com.example.api.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Majors")
public class Major {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "name", columnDefinition = "nvarchar(255)")
    private String name;

    @OneToMany(mappedBy = "major",cascade = CascadeType.ALL, orphanRemoval = true )
    @JsonIgnore
    private List<User> users;
}
