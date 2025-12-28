
package com.yfdecor.dto.request;

import lombok.Data;

@Data
public class AddressRequest {
	private String name;
	private String phone;
	private String addressLine1;
	private String addressLine2;
	private String city;
	private String state;
	private String country;
	private String zipCode;
	private Boolean isDefault;
}
