
package com.yfdecor.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponse {
	private Long id;
	private String email;
	private String name;
	private String phone;
	private String gender;
	private String avatarUrl;
	private String address;
	private String city;
	private String state;
	private String country;
	private String zipCode;
}
