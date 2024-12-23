export interface TitleVO {
  value?: string;
}

export interface AuthorVO {
  value?: string;
}

export interface SongBase {
  publicId?: string;
  title?: TitleVO;
  author?: AuthorVO;
}

export interface SaveSong extends SongBase {
  file?: File;
  fileContentTypes?: string;
  cover?: File;
  coverContentTypes: string;
}