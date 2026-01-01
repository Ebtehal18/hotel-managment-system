import {
  Box,
  Breadcrumbs,
  Grid,
  InputLabel,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
  Button,
  IconButton,
  CircularProgress,
  Rating,
  Divider,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useGetRoomDetails } from "../../../hooks/UseGetRoomDetails";
import { Link as RouterDom } from "react-router-dom";
import { DateRangePicker, InputGroup, type PickerHandle } from "rsuite";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useAddBooking } from "../../../hooks/useAddBooking";
import toast from "react-hot-toast";
import bedimg from "../../../assets/ic_bedroom.png";
import livimg from "../../../assets/ic_livingroom.png";
import bathimg from "../../../assets/ic_bathroom.png";
import dingimg from "../../../assets/ic_diningroom.png";
import wifiimg from "../../../assets/ic_wifi.png";
import unitsimg from "../../../assets/ic_ac.png";
import refimg from "../../../assets/ic_kulkas.png";
import tvimg from "../../../assets/ic_tv.png";
import StarIcon from '@mui/icons-material/Star';
import { useForm, type SubmitHandler } from "react-hook-form";
import { useCreateReview, type IReviewCreate } from "../../../hooks/useCreateReview";
import { useCreateComment, type ICommentCreate } from "../../../hooks/useCreateComment";
import { useQueryClient } from "@tanstack/react-query";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CreateIcon from '@mui/icons-material/Create';
import commentImg from '../../../assets/add-comment.svg'
import review from '../../../assets/add-review.svg'
import { useGetReviews } from "../../../hooks/useGetReviews";
import { useGetComments } from "../../../hooks/useGetComments";
import { UseAuth } from "../../../context/AuthContext";
import empty from '../../../assets/empty-1-Cp9p7e3t.svg'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useDeleteComment } from "../../../hooks/useDeleteComment";
import { useUpdateComment } from "../../../hooks/useUpdateComment";
import type { AxiosError } from "axios";

 const labels: { [index: string]: string } = {
  1: '1.0',
  2: '2.0',
  3: '3.0',
  4: '4.0',
  5: '5.0',
};
function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

export default function RoomDetails() {
    const [tabVal, setTabVal] =useState('1');
const {isAuthenticated,fillData}=UseAuth()
console.log(fillData)
// console.log(isAuthenticated)
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabVal(newValue);
  };
  const { t } = useTranslation();
  const theme = useTheme();
  const { id } = useParams();
  const [value, setValue] = useState<number | null>(2);
  const [hover, setHover] = useState(-1);

  const { data } = useGetRoomDetails(id ?? "");
  const room = data?.data.room;


const {
    register: registerRate,
    handleSubmit: handleSubmitRate,
    formState: { errors: errorsRate }, 
  } = useForm<IReviewCreate>();

  // Second form: Add Comment
  const {
    register: registerComment,
    handleSubmit: handleSubmitComment,
    formState: { errors: errorsComment },
    setValue:setComment
  } = useForm<ICommentCreate>();

const {mutate:createReview,isPending:isReview}=useCreateReview()
const {mutate:createComment,isPending:isCommenting}=useCreateComment()
const {mutate:deleteComment,isPending:isDeletingComment}=useDeleteComment()
const {mutate:updateComment,isPending:isUpdatingComment}=useUpdateComment()

const querClient=useQueryClient()
  const onSubmitRate: SubmitHandler<IReviewCreate> = async (data) => {
    if(id){
      const payload={
      ...data,
      rating:value,
      roomId:id
    }
    createReview(payload,{
      onSuccess:(res)=>{
        toast.success(res.message)
querClient.invalidateQueries({
  queryKey:['roomReviews']
})
      },
       onError:(err)=>{
  toast.error(err?.response?.data?.message || 'Something went wrong');

      }
    })
    }
  };

  // Submit handler for comment
  const onSubmitComment: SubmitHandler<ICommentCreate> = async (data) => {
if(id&&!selectedComment){
          const payload={
      ...data,
      roomId:id
    }
console.log(payload) 
   createComment(payload,{
      onSuccess:(res)=>{
        toast.success(res.message)
querClient.invalidateQueries({
  queryKey:['roomComments']
})
setComment("comment",'')
      },
       onError:(err)=>{
  toast.error(err?.response?.data?.message || 'Something went wrong');

      }
    })
}else{
updateComment(
    {
      comment: data.comment, // your current input value
      id: selectedComment?._id??"",
    },
    {
      onSuccess: (res) => {
        toast.success(res.message);

        // Invalidate and refetch the comments list
        querClient.invalidateQueries({
          queryKey: ['roomComments'],
        });
setComment("comment",'')

        // Reset the input field
      },
      onError: (err: AxiosError<{ message: string }>) => {
        const errorMessage =
          err?.response?.data?.message || 'Something went wrong';
        toast.error(errorMessage);
      },
    }
  );
}
  
  }
//deleye comment
  const delteComment=(id:string)=>{
    console.log(id)
    if(id){
      deleteComment(id,{
        onSuccess:(res)=>{
      toast.success(res.message)
querClient.invalidateQueries({
  queryKey:['roomComments']
})
        }
           , onError:(err)=>{
            console.log(err)
  toast.error(err?.response?.data?.message || 'Something went wrong');

      }
      })
    }
  }
const [selectedComment,setSelectedComment]=useState<null|{comment:string,_id:string}>(null)
  
  const {data:reviews,isLoading:isLoadingReviewing}=useGetReviews(id!)
  const {data:comments,isLoading:isLoadingComment}=useGetComments(id!)

    const details = [
    { img: bedimg, number: "5", desc: t("room.Bedrooms") },
    { img: livimg, number: "1", desc: t("room.LivingRoom") },
    { img: bathimg, number: "3", desc: t("room.Bathrooms") },
    { img: dingimg, number: "1", desc: t("room.DiningRoom") },
    { img: wifiimg, number: "10", desc: t("room.Wifi") },
    { img: unitsimg, number: "7", desc: t("room.UnitsReady") },
    { img: refimg, number: "2", desc: t("room.Refrigerators") },
    { img: tvimg, number: "4", desc: t("room.Televisions") },
  ];
  const realPrice = room?.price
    ? room?.price - ((room?.discount ?? 0) / 100) * room?.price
    : 0;
  // console.log(realPrice, room?.price, room?.discount);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [guests, setGusters] = useState(1);


  // const [finalPrice,setFinalPrice]=useState(realPrice)
  const pickerRef = useRef<PickerHandle>(null);

  const openCalendar = () => {
    if (pickerRef.current) {
      pickerRef.current.open?.();
    }
  };

  const handelPick = (value: Date[] | null) => {
    if (!value) {
      setStartDate(null);
      setEndDate(null);
      return;
    }

    const [start, end] = value;
    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end?.toISOString().split("T")[0]);
  };
  const { mutate: addBooking, isPending } = useAddBooking();
  const naivgate = useNavigate();
  const handelBooking = () => {
    if (!localStorage.getItem("token")) {
      toast.error("Please Login First");
      return;
    }
    addBooking(
      {
        room: id ?? "",
        startDate: startDate ?? "",
        endDate: endDate ?? "",
        totalPrice: realPrice,
      },
      {
        onSuccess: (res) => {
          naivgate(`/checkOut/${res.data?.booking?._id}`);
          toast.success(res.message);
        },
      }
    );
  };
  useEffect(()=>{
if(selectedComment){
  setComment('comment',selectedComment.comment)
}
  },[selectedComment])
  // console.log(reviews?.data.roomRe
  // views)
  return (
    <>
      <Box sx={{ p: 5, mt: 3 }}>
        <Stack alignItems={"center"}>
          <Typography
            sx={{
              textAlign: "center",
              color: theme.palette.text.disabled,
              fontSize: "26px",
              fontWeight: 600,
            }}
          >
            {room?.roomNumber}
          </Typography>
          <Typography sx={{ color: "#B0B0B0" }}>
            {t("user.location")}
          </Typography>
        </Stack>
        <Breadcrumbs maxItems={2} aria-label="breadcrumb">
          <Link
            component={RouterDom}
            underline="hover"
            color="inherit"
            to={"/"}
          >
            {t("user.home")}
          </Link>
          <Link
            underline="hover"
            color="inherit"
            sx={{ color: theme.palette.text.disabled }}
          >
            {t("user.roomDetails")}
          </Link>
        </Breadcrumbs>
        {/* images */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              component={"img"}
              width={"100%"}
              sx={{ borderRadius: "15px", height: 480, objectFit: "cover" }}
              src={room?.images[0]}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              component={"img"}
              width={"100%"}
              sx={{
                borderRadius: "15px",
                height: room?.images[1] ? 240 : "",
                objectFit: "cover",
              }}
              src={room?.images[1]}
            />
            <Box
              component={"img"}
              width={"100%"}
              sx={{
                borderRadius: "15px",
                height: room?.images[2] ? 240 : "",
                objectFit: "cover",
              }}
              src={room?.images[2]}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              component={"img"}
              width={"100%"}
              sx={{
                borderRadius: "15px",
                height: room?.images[3] ? 240 : "",
                objectFit: "cover",
              }}
              src={room?.images[3]}
            />
            <Box
              component={"img"}
              width={"100%"}
              sx={{
                borderRadius: "15px",
                height: room?.images[4] ? 240 : "",
                objectFit: "cover",
              }}
              src={room?.images[4]}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack gap={1}>
              <Typography sx={{ color: "#B0B0B0" }}>{t("user.t1")}</Typography>
              {/* <br/> */}
              <Typography sx={{ color: "#B0B0B0" }}>{t("user.t2")}</Typography>
              {/* <br/> */}
              <Typography sx={{ color: "#B0B0B0" }}>{t("user.t3")}</Typography>
              {/* <br/> */}
            </Stack>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {details.map((detail) => (
                <Grid
                  size={{ md: 3, xs: 6 }}
                  component={"div"}
                  sx={{ mb: "20px" }}
                >
                  <Box
                    component={"img"}
                    src={detail.img}
                    sx={{ objectFit: "cover" }}
                  ></Box>
                  <Typography
                    component={"p"}
                    sx={{ color: "#000", fontWeight: 700, fontSize: "20px" }}
                  >
                    {detail.number}{" "}
                    <Typography component={"span"} sx={{ color: "#757575" }}>
                      {detail.desc}
                    </Typography>{" "}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: "15px",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography
                sx={{ fontWeight: 500, color: theme.palette.text.disabled }}
              >
                {t("user.startBooking")}
              </Typography>
              <Typography sx={{ color: "#B0B0B0", fontSize: "30px" }}>
                <Typography
                  component={"span"}
                  sx={{ color: "#1ABC9C", fontWeight: 500, fontSize: "30px" }}
                >
                  {realPrice} {t("user.egp")}
                </Typography>{" "}
                {t("user.pernight")}
              </Typography>
              <Typography sx={{ color: "#FF1612" }}>
                {" "}
                <Typography
                  sx={{ textDecoration: "line-through", opacity: "0.6" }}
                  component={"span"}
                >
                  {room?.price} {t("user.egp")}
                </Typography>{" "}
                {t("user.discount")} {room?.discount}% {t("user.off")}
              </Typography>

              <Stack gap={1.5}>
                {/* date */}
                <InputLabel sx={{ color: theme.palette.text.disabled }}>
                  {t("user.pick")}
                </InputLabel>
                {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  {/* // Wrap with InputGroup for left icon + bg */}
                  <InputGroup inside style={{ width: "100%", height: 60 }}>
                    {/* Left Calendar Icon with Background */}
                    <InputGroup.Addon
                      onClick={openCalendar}
                      style={{
                        cursor: "pointer",
                        backgroundColor: theme.palette.primary.main,
                        height: "100%",
                        display: "flex",
                        borderRadius: "8px 0 0 8px",
                        padding: "16px",
                        alignItems: "center",
                        justifyContent: "center",
                        // margin: '6px 12px',
                      }}
                    >
                      <CalendarMonthIcon
                        style={{ color: "#fff", fontSize: 24 }}
                      />
                    </InputGroup.Addon>

                    {/* DateRangePicker */}
                    <DateRangePicker
                      ref={pickerRef}
                      onChange={handelPick}
                      placeholder="Check-in ~ Check-out"
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        fontFamily: "Rubik",
                      }}
                      caretAs={null}
                      className="custom-range-picker"
                    />
                  </InputGroup>
                </Stack>
                {/* capacity */}
                <InputLabel sx={{ color: theme.palette.text.disabled }}>
                  {t("user.guests")}
                </InputLabel>

                {/* Guests Counter - Fixed Version */}

                <Box
                  sx={{
                    display: "flex",
                    height: 56, // same as TextField default
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider", // mimics TextField border
                  }}
                >
                  <IconButton
                    disabled={guests === 1}
                    onClick={() => setGusters((prev) => Math.max(1, prev - 1))}
                    sx={{
                      borderRadius: "8px 0 0 8px",
                      bgcolor: theme.palette.error.main,
                      p: 2,
                      color: "#fff",
                      "&:hover": {
                        bgcolor: theme.palette.error.dark,
                      },
                      "&.Mui-disabled": {
                        bgcolor: theme.palette.action.disabledBackground,
                      },
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>

                  <TextField
                    value={guests}
                    InputProps={{ readOnly: true }}
                    sx={{
                      flex: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 0,
                        height: "100%",
                        "& fieldset": { border: "none" },
                      },
                      "& input": {
                        textAlign: "center",
                        py: 1.5,
                      },
                    }}
                    variant="outlined"
                  />

                  <IconButton
                    disabled={guests === 3}
                    onClick={() => setGusters((prev) => Math.min(3, prev + 1))}
                    sx={{
                      borderRadius: "0 8px 8px 0",
                      bgcolor: theme.palette.success.main,
                      p: 2,
                      height: "100%",
                      color: "#fff",
                      "&:hover": {
                        bgcolor: theme.palette.success.dark,
                      },
                      "&.Mui-disabled": {
                        bgcolor: theme.palette.action.disabledBackground,
                      },
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>

                <Typography>
                  {t("user.Youwillpay")}{" "}
                  <Typography
                    sx={{
                      textDecoration: "line-through",
                      opacity: "0.6",
                      color: "#FF1612",
                    }}
                    component={"span"}
                  >
                    {room?.price} {t("user.egp")}{" "}
                  </Typography>
                  {realPrice * guests} {t("user.egp")} {t("user.per")} {guests}{" "}
                  {t("user.person")}(s)
                </Typography>
                <Button
                  disabled={!startDate || !endDate || isPending}
                  variant="contained"
                  sx={{ mt: 2, py: 1 }}
                  onClick={handelBooking}
                >
                  {isPending ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />

                      {t("user.bookingRoom")}
                    </>
                  ) : (
                    t("user.continueBooking")
                  )}
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          sx={{ mt: 2, borderRadius: "15px", border: "1px solid #e5e5e5" }}
        >
          <Grid size={{ xs: 12, md: 6 }} sx={{p:2}}>
          <Typography sx={{color:theme.palette.text.disabled,fontWeight:600,fontSize:"18px"}}>{t("user.rate")}</Typography>

 <Box sx={{ width: 200, display: 'flex', alignItems: 'center',my:2 }}>
      <Rating
        name="hover-feedback"
        value={value}
        precision={1}
        getLabelText={getLabelText}
        onChange={(_event, newValue) => {
          setValue(newValue);
        }}
        onChangeActive={(_event, newHover) => {
          setHover(newHover);
        }}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
      />
      {value !== null && (
        <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
      )}
    </Box>
          <TextField 
          multiline
          fullWidth
          rows={5}
          placeholder="Please type here"
          {...registerRate("review", { required: t('user.reviewrequired') })} 
          error={!!errorsRate.review}
          helperText={errorsRate.review?.message}
          />
<Button variant="contained" sx={{mt:2}}

disabled={isReview}

onClick={handleSubmitRate(onSubmitRate)} 
>

    {isReview?<>
                      <CircularProgress size={20} sx={{  mr: 1 }}  />
        
      {  t("user.rating")}
        </>
        :
      t("user.rate")}
</Button>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{p:2}}>
              <Typography sx={{color:theme.palette.text.disabled,fontWeight:600,fontSize:"18px"}}>{t("user.AddYourComment")}</Typography>
               <Box sx={{ width: 200, display: 'flex', alignItems: 'center',my:2 ,height:24}}>

    </Box>
          <TextField 
          multiline
          fullWidth
          rows={5}
                    placeholder="Please type here"
                    {...registerComment("comment", { required:t('user.commentRequired') })}
          error={!!errorsComment.comment}
          helperText={errorsComment.comment?.message}

          />
          <Button variant="contained"
          
          onClick={handleSubmitComment(onSubmitComment)} 

          sx={{mt:2}}>{
            isCommenting?<>
                  <CircularProgress size={20} sx={{  mr: 1 }}  />
        
      {  t("user.commenting")}
            </>
      :
            t("user.AddYourComment")}</Button>
          </Grid>
        </Grid>
      </Box>
      {/* show comments and reviews */}
      <Box sx={{ typography: 'body1',m:4 }}>
    <TabContext value={tabVal}>
      {/* Tabs with Grid layout */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider',backgroundColor:"#e7eeff",p:1,borderRadius:"8px" }}>
        <Grid container>
          <Grid size={{xs:12,md:6}}>
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              variant="fullWidth" 
            sx={{
    '& .MuiTabs-indicator': {
      display: 'none',  // Hides the underline
    },
  }}
            >
              <Tab 
     sx={{
    backgroundColor: tabVal === '1' ? 'white' : 'transparent',
    borderRadius: '8px',
    boxShadow: tabVal === '1' ? '0px 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
    transition: 'all 0.3s ease',
    textTransform: 'none',
    fontWeight: tabVal === '1' ? 600 : 500,

    color: theme.palette.text.disabled,
'&.Mui-selected': {
      color: theme.palette.text.disabled + ' !important', 
    },
    opacity: tabVal === '1' ? 1 : 0.7,

    '&:hover': {
      opacity: 1,
      backgroundColor: tabVal === '1' ? 'white' : 'rgba(255, 255, 255, 0.08)',
    },
  }}
              
              label={
                <Stack direction={'row'} gap={1}>
                <StarBorderIcon sx={{color:'rgb(250, 175, 0)'}}/>
                <Typography >{t("user.reviews")}</Typography>
                </Stack>
              } value="1" />
            </TabList>
          </Grid>

          <Grid size={{xs:12,md:6}}>
          <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              variant="fullWidth" 
            sx={{
    '& .MuiTabs-indicator': {
      display: 'none',  // Hides the underline
    },
  }}
            >
              <Tab 
     sx={{
    backgroundColor: tabVal === '2' ? 'white' : 'transparent',
    borderRadius: '8px',
    boxShadow: tabVal === '2' ? '0px 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
    transition: 'all 0.3s ease',
    textTransform: 'none',
    fontWeight: tabVal === '2' ? 600 : 500,

    color: theme.palette.text.disabled,
'&.Mui-selected': {
      color: theme.palette.text.disabled + ' !important', 
    },
    opacity: tabVal === '2' ? 1 : 0.7,

    '&:hover': {
      opacity: 1,
      backgroundColor: tabVal === '2' ? 'white' : 'rgba(255, 255, 255, 0.08)',
    },
  }}
              
              label={
                <Stack direction={'row'} gap={1}>
                <CreateIcon sx={{color:'primary.main'}}/>
                <Typography >{t("user.comments")}</Typography>
                </Stack>
              } value="2" />
            </TabList>
          </Grid>
        </Grid>
      </Box>

      {/* Tab Panels */}
      <TabPanel value="1">
       <Grid container spacing={2} sx={{border:"1px solid #e5e5e5",borderRadius:"8px",p:
          4
        }}>
          {isAuthenticated?
<>

  <Grid size={{ xs: 12, md: 6 }}>
  <Stack 
    divider={<Divider flexItem />}   
    spacing={3}                    
  >
    {reviews?.data.roomReviews.map(({ _id, createdAt, user, rating, review }) => (
      <Stack 
        key={_id} 
        direction="row" 
        gap={2} 
        alignItems="flex-start"
      >
        <Box
          component="img"
          src={user.profileImage}
          alt={user.userName}
          sx={{ 
            width: 48, 
            height: 48, 
            borderRadius: "50%", 
            objectFit: "cover",
            flexShrink: 0 
          }}
        />

        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 500, color: theme.palette.text.disabled }}>
            {user.userName}
          </Typography>

          <Stack direction="row">
            {Array.from({ length: 5 }, (_, i) =>
              i < rating ? (
                <StarIcon key={i} sx={{ color: 'rgb(250, 175, 0)', fontSize: 20 }} />
              ) : (
                <StarBorderIcon key={i} sx={{ color: 'rgb(250, 175, 0)', fontSize: 20 }} />
              )
            )}
          </Stack>

          <Typography sx={{ color: 'oklch(0.373 0.034 259.733)', wordBreak: 'break-word' }}>
            {review}
          </Typography>

          <Stack direction="row" gap={1} alignItems="center">
            <CalendarMonthIcon fontSize="small" />
            <Typography variant="body2">
              {new Date(createdAt).toLocaleDateString()}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    ))}
  </Stack>
</Grid>
          <Grid size={{xs:12,md:6}} sx={{p:2,display:{xs:"none",md:"block"}}}>
<Box component={'img'} src={review} sx={{width:"70%"}}/>
          </Grid>
</>

          :<Stack gap={2} justifyContent={'center'} alignItems={'center'} sx={{width:"100%"}}>
          <Stack justifyContent={'center'} sx={{width:"100%",alignItems:"center"}}>
                      <Box component={'img'} src={empty} sx={{height:192,width:192}}/>

          </Stack>
          <Typography>{t("user.noLog")}</Typography>
          </Stack>
        }
        </Grid>
      </TabPanel>
      <TabPanel value="2">

  <Grid container spacing={2} sx={{border:"1px solid #e5e5e5",borderRadius:"8px",p:
          4
        }}>

               {isAuthenticated?<>
                 <Grid size={{ xs: 12, md: 6 }}>
  <Stack 
    divider={<Divider flexItem />}   
    spacing={3}                    
  >
    {comments?.data.roomComments.map(({ _id, createdAt, user,comment }) => (
      <Stack 
        key={_id} 
        direction="row" 
        gap={2} 
        alignItems="flex-start"
      >
        <Box
          component="img"
          src={user.profileImage}
          alt={user.userName}
          sx={{ 
            width: 48, 
            height: 48, 
            borderRadius: "50%", 
            objectFit: "cover",
            flexShrink: 0 
          }}
        />

        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 500, color: theme.palette.text.disabled }}>
            {user.userName}
          </Typography>

        

          <Typography sx={{ color: 'oklch(0.373 0.034 259.733)', wordBreak: 'break-word' }}>
            {comment}
          </Typography>

          <Stack direction="row" gap={1} alignItems="center">
            <CalendarMonthIcon fontSize="small" />
            <Typography variant="body2">
              {new Date(createdAt).toLocaleDateString()}
            </Typography>
          </Stack>
        </Stack>
        {fillData?._id===user._id&&<>
        <IconButton onClick={()=>delteComment(_id)} disabled={isDeletingComment}>
                  <DeleteIcon sx={{color:"#f6454b"}}/>

        </IconButton>
        <IconButton sx={{color:"rgb(126, 133, 146)"}} onClick={()=>setSelectedComment({comment,_id})}>

<EditIcon/>
        </IconButton>
        </>}
      </Stack>
    ))}
  </Stack>
</Grid>
          <Grid size={{xs:12,md:6}} sx={{p:2,display:{xs:"none",md:"block"}}}>
<Box component={'img'} src={commentImg} sx={{width:"70%"}}/>
          </Grid>
          
          </>:
          <Stack gap={2} justifyContent={'center'} alignItems={'center'} sx={{width:"100%"}}>
          <Stack justifyContent={'center'} sx={{width:"100%",alignItems:"center"}}>
                      <Box component={'img'} src={empty} sx={{height:192,width:192}}/>

          </Stack>
          <Typography>{t("user.noLog")}</Typography>
          </Stack>}
               

        </Grid>

      </TabPanel>
    </TabContext>
  </Box>
    </>
  );
}
