
export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface ProjectItem {
  title: string;
  category: string;
  image: string;
  link: string;
}
