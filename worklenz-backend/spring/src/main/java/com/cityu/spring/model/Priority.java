package com.cityu.spring.model;
import java.util.UUID;
import lombok.*;
import jakarta.persistence.*;

@Data 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder

@Entity
@Table(name = "task_priorities")
public class Priority {
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "value", nullable = false)
    @Builder.Default
    private int value=0;

    @Column(name = "color_code", nullable = false)
    private String colorCode;

    @Column(name = "color_code_dark")
    private String colorCodeDark;

}
