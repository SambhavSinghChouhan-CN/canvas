
package com.yfdecor.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
	private Long id;
	private String name;
	private String slug;
	private String description;
	private String imageUrl;
	private Integer stock;
	private Double price;
	private Double discount;
	private CategoryResponse category;
}
