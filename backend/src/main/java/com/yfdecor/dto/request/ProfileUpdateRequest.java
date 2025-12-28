
package com.yfdecor.dto.request;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
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
