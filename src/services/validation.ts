export const getEmailValidation = (lng: "en" | "ar") => ({

  required: lng === "ar" ? "البريد الإلكتروني مطلوب" : "Email is Required",
  pattern: {
    value:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    message:
      lng === "ar"
        ? "يرجى إدخال بريد إلكتروني صحيح"
        : "Please enter a valid email",
  },
});
export const getPassValidation = (lng: 'en' | 'ar') => ({
  required: lng === 'ar' ? 'كلمة المرور مطلوبة' : 'Password is required',
  pattern: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
    message: lng === 'ar'
      ? 'يجب أن تحتوي كلمة المرور على حرف صغير وحرف كبير ورقم ورمز خاص، وطولها لا يقل عن 6 أحرف.'
      : 'The password must include at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 6 characters long.',
  },
});
export const getFacilityNameValidation = (lng: 'en' | 'ar') => ({
  required: lng === 'ar' ? 'الاسم مطلوب' : 'name is required',
});
export const getRoomValidation = (lng: 'en' | 'ar') => ({
  required: lng === 'ar' ? ' رقم الغرفة مطلوبة' : 'Room Number is required',
});
export const getIsActiveValidation = (lng: 'en' | 'ar') => ({
  required: lng === 'ar' ? 'الحالة مطلوبة' : 'Status is required',
});
export const getDiscountValidation = (lng: 'en' | 'ar') => ({
  required: lng === 'ar' ? 'الخصم مطلوب' : 'Discount is required',
   min: {
    value: 0,
    message: lng === 'ar' ? 'الخصم لا يمكن أن يكون أقل من 0' : 'Discount cannot be less than 0',
  },
  max: {
    value: 100,
    message: lng === 'ar' ? 'الخصم لا يمكن أن يتجاوز 100' : 'Discount cannot exceed 100',
  },
});
export const getRoomNumberValidation = (lng: "en" | "ar") => ({
   
    required: {
      value: true,
      message: lng === "en" ? "Room number is required" : "رقم الغرفة مطلوب",
    },
    minLength: {
      value: 1,
      message: lng === "en" ? "Room number cannot be empty" : "لا يمكن أن يكون رقم الغرفة فارغًا",
    },
    maxLength: {
      value: 50,
      message: lng === "en" ? "Room number is too long" : "رقم الغرفة طويل جدًا",
    },
  })
export const getPriceValidation=(lng: "en" | "ar") => ({
  required: {
      value: true,
      message: lng === "en" ? "Price is required" : "السعر مطلوب",
    },
    min: {
      value: 0,
      message: lng === "en" ? "Price cannot be negative" : "السعر لا يمكن أن يكون سالبًا",
    },
    max: {
      value: 100000,
      message: lng === "en" ? "Price is too high" : "السعر كبير جدًا",
    },
    validate: (value: string) =>
      !isNaN(Number(value)) || (lng === "en" ? "Price must be a number" : "يجب أن يكون السعر رقمًا"),
})
 
export const getCapacityDiscount=(lng: "en" | "ar")=>({
 required: {
      value: true,
      message: lng === "en" ? "Capacity is required" : "السعة مطلوبة",
    },
    min: {
      value: 1,
      message: lng === "en" ? "Capacity must be at least 1" : "يجب أن تكون السعة 1 على الأقل",
    },
    max: {
      value: 100,
      message: lng === "en" ? "Capacity cannot exceed 100" : "لا يمكن أن تتجاوز السعة 100",
    },
    validate: (value: string) =>
      !isNaN(Number(value)) || (lng === "en" ? "Capacity must be a number" : "يجب أن تكون السعة رقمًا"),
})

export const getFacilitiesValidation=(lng:"en"|"ar")=>({
   required: {
      value: true,
      message: lng === "en" ? "Facility is required" : "المرفق مطلوب",
    },
     validate: (value: string[]) =>{
      if(value.length<2){
        return lng==='en'?"Select at least 2 facilities" :"اختر على الأقل مرفقين"
      }
      return true
     }
})
export const getUsernameValidation = (lng: "en" | "ar") => ({
  required: {
    value: true,
    message: lng === "en" ? "Username is required" : "اسم المستخدم مطلوب",
  },
  minLength: {
    value: 3,
    message:
      lng === "en"
        ? "Username must be at least 3 characters"
        : "يجب أن يكون اسم المستخدم 3 أحرف على الأقل",
  },
  pattern: {
    value: /^[A-Za-z0-9_.]+$/,
    message:
      lng === "en"
        ? "Username can contain only letters, numbers, . and _"
        : "اسم المستخدم يجب أن يحتوي على أحرف وأرقام فقط",
  },
});
export const getCountryValidation = (lng: "en" | "ar") => ({
  required: {
    value: true,
    message: lng === "en" ? "Country is required" : "الدولة مطلوبة",
  },
  pattern: {
    value: /^[A-Za-z\u0600-\u06FF\s]+$/,
    message:
      lng === "en"
        ? "Country name must contain letters only"
        : "اسم الدولة يجب أن يحتوي على أحرف فقط",
  },
});


export const getEgyptianPhoneValidation = (lng: "en" | "ar") => ({
  required: {
    value: true,
    message:
      lng === "en" ? "Phone number is required" : "رقم الهاتف مطلوب",
  },
  pattern: {
    value: /^01[0-2,5]\d{8}$/,
    message:
      lng === "en"
        ? "Enter a valid Egyptian phone number"
        : "أدخل رقم هاتف مصري صحيح",
  },
});

export const getConfirmPasswordValidation = (
  lng: "en" | "ar",
  password: string
) => ({
  required: {
    value: true,
    message:
      lng === "en"
        ? "Confirm password is required"
        : "تأكيد كلمة المرور مطلوب",
  },
  validate: (value: string) => {
    if (value !== password) {
      return lng === "en"
        ? "Passwords do not match"
        : "كلمتا المرور غير متطابقتين";
    }
    return true;
  },
});

