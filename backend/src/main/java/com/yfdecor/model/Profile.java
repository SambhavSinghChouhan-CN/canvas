
package com.yfdecor.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	private String phone;
	private String gender;
	private String avatarUrl;
	private String address;
	private String city;
	private String state;
	private String country;
	private String zipCode;
}
