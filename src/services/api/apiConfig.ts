export const Auth={
    login:'/api/v0/admin/users/login',
    register:"/api/v0/admin/users",
    forget:"/api/v0/admin/users/forgot-password",
    reset:"/api/v0/admin/users/reset-password",
    change:"/api/v0/admin/users/change-password",
    profile:(id:string)=>`/api/v0/admin/users/${id}`
}
export const Admin={
    dashboard:"/api/v0/admin/dashboard",
    users:(page:number,size:number)=>`/api/v0/admin/users?page=${page}&size=${size}`,
    rooms:(page:number,size:number)=>`/api/v0/admin/rooms?page=${page}&size=${size}`,

    room:(id:string)=>`/api/v0/admin/rooms/${id}`,

    ads:(page:number,size:number)=>`/api/v0/admin/ads?page=${page}&size=${size}`,
    facilities:(page:number,size:number)=>`/api/v0/admin/room-facilities?page=${page}&size=${size}`,
    booking:(page:number,size:number)=>`/api/v0/admin/booking?page=${page}&size=${size}`,

    addFacility:`/api/v0/admin/room-facilities`,
    updateFacility:(id:string)=>`/api/v0/admin/room-facilities/${id}`,
    deleteFacility:(id:string)=>`/api/v0/admin/room-facilities/${id}`,

    deleteBooking:(id:string)=>`/api/v0/admin/booking/${id}`,

    addAds:`/api/v0/admin/ads`,
    updateAds:(id:string)=>`/api/v0/admin/ads/${id}`,
    deleteAds:(id:string)=>`/api/v0/admin/ads/${id}`,
    
    addRoom:`/api/v0/admin/rooms`,
    deleteRoom:(id:string)=>`/api/v0/admin/rooms/${id}`,
    updateRoom:(id:string)=>`/api/v0/admin/rooms/${id}`,

    mostPopular:    `/api/v0/portal/ads`,
    roomDetails:(id:string)=>`api/v0/portal/rooms/${id}`,
    roomAvaliable:(page:number,size:number,startDate?:string,endDate?:string,capacity?:number)=>{
        const params = new URLSearchParams();
        params.append("page", page.toString());
  params.append("size", size.toString());
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (capacity) params.append("capacity", capacity.toString());
        console.log(params.toString())
        return `api/v0/portal/rooms/available?${params.toString()}`;
    },

    getFavRooms:`/api/v0/portal/favorite-rooms`,
    addFavRoom:`/api/v0/portal/favorite-rooms`,
    removeFavRoom: (id:string)=> `/api/v0/portal/favorite-rooms/${id}`,

    getReviews:(id:string)=>`api/v0/portal/room-reviews/${id}`,
    createReview:`api/v0/portal/room-reviews`,
    updateReview:(id:string)=>`api/v0/portal/room-comments/${id}`,

    getComments:(id:string)=>`api/v0/portal/room-comments/${id}`,
    createComment:`api/v0/portal/room-comments`,
    updateComment:(id:string)=>`api/v0/portal/room-comments/${id}`,
    deleteComment:(id:string)=>`api/v0/portal/room-comments/${id}`,

    createBooking:`api/v0/portal/booking`,
    getBooking:(page:number,size:number)=>`/api/v0/portal/booking/my?page=${page}&size=${size}`,
    payBooking:(id:string)=>`api/v0/portal/booking/${id}/pay`
}