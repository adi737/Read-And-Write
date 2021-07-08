import { CombinedState } from "redux";

export interface HotModule extends NodeModule {
  hot: {
    accept: (arg1: string, arg2: () => void) => void
  };
}

export interface State extends CombinedState<{
  profile: {
    profiles: {
      _id: string;
      userID: {
        nick: string;
        avatar: string;
      };
      status: string;
      company: string;
      location: string;
      skills: [string];
      experience: {
        _id: string;
        description: string;
        position: string;
        company: string;
        location: string;
        from: string;
        current: boolean;
        to: string
      }[];
      education: {
        _id: string;
        school: string;
        fieldofstudy: string;
        degree: string;
        description: string;
        from: string;
        current: boolean;
        to: string;
      }[];
      youtube: string;
      twitter: string;
      facebook: string;
      linkedin: string;
      instagram: string;
      date: string;
    }[]
    profile: {
      _id: string;
      userID: {
        nick: string;
        avatar: string;
      };
      status: string;
      company: string;
      location: string;
      skills: [string];
      experience: {
        _id: string;
        description: string;
        position: string;
        company: string;
        location: string;
        from: string;
        current: boolean;
        to: string
      }[];
      education: {
        _id: string;
        school: string;
        fieldofstudy: string;
        degree: string;
        description: string;
        from: string;
        current: boolean;
        to: string;
      }[];
      youtube: string;
      twitter: string;
      facebook: string;
      linkedin: string;
      instagram: string;
      loading: boolean;
      date: string;
    }
    loading: boolean;
    errors: [];
  };
  article: {
    articles: {
      _id: string;
      userID: {
        nick: string;
        avatar: string;
      };
      topic: string;
      intro: string;
      description: string;
      picture: {
        _id: string;
        imgUrl: string;
        imgName: string;
      }[];
      likes: [];
      dislikes: [];
      comments: [];
      date: string;
    }[]
    article: {
      _id: string;
      userID: string;
      topic: string;
      intro: string;
      description: string;
      picture: {
        _id: string;
        imgUrl: string;
        imgName: string;
      }[];
      likes: {
        _id: string;
        userID: string;
      }[];
      dislikes: {
        _id: string;
        userID: string;
      }[];
      comments: {
        _id: string;
        likes: {
          _id: string;
          userID: string;
        }[];
        dislikes: {
          _id: string;
          userID: string;
        }[];
        date: string;
        userID: {
          _id: string;
          avatar: string;
          nick: string;
        };
        text: string;
      }[]
      loading: boolean;
      date: string;
    };
    loading: boolean;
    errors: [];
  };
  user: {
    token: string;
    userID: string;
    isLogged: boolean;
    loading: boolean;
    errors: [];
  };
}> { }

export interface ProfileState {
  _id: string;
  userID: {
    nick: string;
    avatar: string;
  };
  status: string;
  company: string;
  location: string;
  skills: [string];
  experience: {
    _id: string;
    description: string;
    position: string;
    company: string;
    location: string;
    from: string;
    current: boolean;
    to: string
  }[];
  education: {
    _id: string;
    school: string;
    fieldofstudy: string;
    degree: string;
    description: string;
    from: string;
    current: boolean;
    to: string;
  }[];
  youtube: string;
  twitter: string;
  facebook: string;
  linkedin: string;
  instagram: string;
  date: string;
}

export interface ProfileFormState {
  description?: string;
  to?: string;
  from?: string;
  degree?: string;
  fieldofstudy?: string;
  school?: string;
}

export interface ArticleState {
  _id: string;
  userID: {
    nick: string;
    avatar: string;
  };
  topic: string;
  intro: string;
  description: string;
  picture: {
    _id: string;
    imgUrl: string;
    imgName: string;
  }[];
  likes: [];
  dislikes: [];
  comments: {
    _id: string;
    likes: string;
    dislikes: string;
    date: string;
    userID: {
      avatar: string;
      nick: string;
    };
    text: string;
  }[]
  date: string;
}

export interface ArticleFormState {
  topic?: string;
  intro?: string;
  description?: string;
}

export interface EducationFormState {
  school?: string;
  degree?: string;
  fieldofstudy?: string;
  description?: string;
  from?: string;
  to?: string;
}

export interface ExperienceFormState {
  position?: string
  company?: string;
  location?: string
  description?: string;
  from?: string;
  to?: string;
}

export interface MediaFormState {
  facebook?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
}

export interface StatusFormState {
  position?: string;
  status?: string;
  company?: string;
  location?: string;
}

export interface SkillsFormState {
  skills?: string[];
}

export interface ChangePasswordFormState {
  password?: string;
}

export interface LoginState {
  username?: string;
  password?: string;
}

export interface RegisterState {
  username?: string;
  email?: string;
  password?: string;
  repassword?: string;
}

export interface EmailState {
  email?: string;
}

export interface PasswordState {
  password?: string;
  repassword?: string;
}

export type DispatchType = (arg0: { type: string; payload?: any, userID?: string | null }) => void;