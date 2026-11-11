package com.cgdn.cinema.modules.movie.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieFilterRequest {
    private String keyword;
    private String status;
    private Long genreId;
    private String genreName;
    private String sortBy;
    
    @Builder.Default
    private int page = 0;

    @Builder.Default
    private int size = 12;
}
