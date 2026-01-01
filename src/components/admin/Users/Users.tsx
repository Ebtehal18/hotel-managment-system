import { Avatar, Box,   Stack, Typography } from "@mui/material";
import GenericTable, {
  type IColumn,
} from "../../../shared/GenericTable/GenericTable";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import GenericDialog from "../../../shared/GenericDialog/GenericDialog";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getDataUsers, useGetUsers, type IUser } from "../../../hooks/useGetUsers";
import SkeletonTable from "../../../shared/GenericTable/SkeletonTable";
import {  useQueryClient } from "@tanstack/react-query";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PublicIcon from "@mui/icons-material/Public";
import SharedHeader from "../../../shared/SharedHeader";

export default function Users() {
 const { t } = useTranslation();

  const columns: IColumn<IUser>[] = [
    { key: "userName", label: t("users.userName") },
    {
      key: "profileImage",
      label: t("users.profileImage"),
      render: (val) => {
        const src= val as string
        return   <Stack justifyContent="center" alignItems="center">
          <Avatar sx={{ width: 56, height: 56 }} src={src} />
        </Stack>
      },
    },
    { key: "email", label: t("users.email") },
    { key: "phoneNumber", label: t("users.phoneNumber") },
    { key: "country", label: t("users.country") },
    { key: "role", label: t("users.role") },
  ];
 
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<null | IUser>(null);
  const [page,setPage]=useState<number>(1)
  const { data, isLoading } = useGetUsers(page);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  
  const onView = () => {
    handleClickOpen();
  };


  const actions = [
    {
      Icon: VisibilityIcon,
      label: t("users.view"),
      handler: (row: IUser) => {
        console.log(row);
        handleClickOpen();
        setSelectedUser(row);
      },
    },
  ];


  const handleChangePage = (
    _event: React.ChangeEvent<unknown> | null,
    newPage: number,
  ) => {
    console.log(newPage)
    setPage(newPage);
  };
const query=useQueryClient()
  useEffect(()=>{

if(data){
  if(page<data?.data?.totalCount){
  query.prefetchQuery({
  queryKey:['users',page+1],
  queryFn:()=>getDataUsers(page+1)
})
}
}
  },[page, query,data])
  return (
    <>
    <SharedHeader 
    title={t("dashboard.users")}
    />
    <Box sx={{ mt: 2 }}>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <GenericTable<IUser>
          columns={columns}
          data={data?.data?.users ?? []}
          actions={actions}
          onView={onView}
          paginated
          totalCount={data?.data.totalCount??0}
          onPageChange={handleChangePage} 
          />
        )}
      <GenericDialog
        open={open}
        title={<Stack alignItems={'center'} sx={{flex:1}}>
       <Typography sx={{fontSize:"20px",fontWeight:"bold" ,color:"#fff"}}>{t("users.userInfo")}</Typography>
       </Stack>}
        handleClose={handleClose}
                backgroundImage="linear-gradient(to right, #3252DF, #35C2FD)"

        children={
          <>
      

        {/* User Avatar */}
        <Stack justifyContent="center" alignItems="center" mb={3}>
          <Avatar
            src={selectedUser?.profileImage}
            alt={selectedUser?.userName}
            sx={{ width: 150, height: 150 }}
          />
          <Typography variant="h6" mt={2}>
            {selectedUser?.userName}
          </Typography>
          <Typography color="text.secondary">{selectedUser?.role}</Typography>
        </Stack>

        {/* User Info */}
     <Stack spacing={1}>
  <Stack direction="row" alignItems="center" spacing={1}>
    <EmailIcon color="primary"/>
    <Typography>
      <strong>{t("users.userName")}:</strong> {selectedUser?.email}
    </Typography>
  </Stack>

  <Stack direction="row" alignItems="center" spacing={1}>
    <PhoneIcon color="primary" />
    <Typography>
      <strong>{t("users.phoneNumber")}:</strong> {selectedUser?.phoneNumber}
    </Typography>
  </Stack>

  <Stack direction="row" alignItems="center" spacing={1}>
    <PublicIcon color="primary"/>
    <Typography>
      <strong>{t('users.country')}:</strong> {selectedUser?.country}
    </Typography>
  </Stack>
</Stack>
          </>
        }
        maxWidth="sm"
        />
    </Box>
        </>
  );
}
