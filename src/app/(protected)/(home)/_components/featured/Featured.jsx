import React, { useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  Grid,
  Divider,
  Paper,
  Slider,
  Alert,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Featured = ({ operations }) => {
  const [open, setOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [progressSize, setProgressSize] = useState(200);
  const [showAlert, setShowAlert] = useState(false);

  const handleClickOpen = (event, operation) => {
    event.stopPropagation();
    setSelectedOperation(operation);
    setOpen(true);
    if (operation.progress === 100) {
      setShowAlert(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOperation(null);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowAlert(false);
  };

  const DetailedInfo = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Total operations made today
      </Typography>
      <Typography variant="h4" gutterBottom>
        {selectedOperation.todayCount}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Previous operations processing
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Typography variant="subtitle2" color="text.secondary">
            Target
          </Typography>
          <Typography variant="h6">{selectedOperation.target}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle2" color="text.secondary">
            Last Week
          </Typography>
          <Typography variant="h6">
            {selectedOperation.lastWeekCount}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle2" color="text.secondary">
            Last Month
          </Typography>
          <Typography variant="h6">
            {selectedOperation.lastMonthCount}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <div className="featured">
      <Box
        className="bottom"
        sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}
      >
        {operations.map((operation) => (
          <Paper
            key={operation.id}
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              transition: "all 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              },
              cursor: "pointer",
            }}
            onClick={(event) => handleClickOpen(event, operation)}
          >
            <Box
              className="featuredChart"
              sx={{
                width: `${progressSize}px`,
                height: `${progressSize}px`,
                margin: "0 auto 20px",
              }}
            >
              <CircularProgressbar
                value={operation.progress}
                text={`${Math.round(operation.progress)}%`}
                strokeWidth={8}
                styles={buildStyles({
                  textSize: `${16 * (progressSize / 200)}px`,
                  pathColor: `rgba(62, 152, 199, ${operation.progress / 100})`,
                  textColor: "#3e98c7",
                  trailColor: "#d6d6d6",
                  pathTransitionDuration: 0.5,
                })}
              />
            </Box>
            <Typography variant="h6" align="center" gutterBottom>
              {operation.name}
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary">
              Completed: {operation.completedCount} / {operation.target}
            </Typography>
          </Paper>
        ))}
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Typography variant="h5" component="div">
            {selectedOperation
              ? `${selectedOperation.name} Details`
              : "Operation Details"}
          </Typography>
          <IconButton aria-label="close" onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>{selectedOperation && <DetailedInfo />}</DialogContent>
      </Dialog>
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Congratulations ! You have reached 100% progress for{" "}
          {selectedOperation?.name} !
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Featured;

// import React, { useState } from "react";
// import { Progress } from "@/components/ui/progress";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { ChevronDown, ChevronUp } from "lucide-react";

// const Featured = ({ operations }) => {
//   const [selectedOperation, setSelectedOperation] = useState(null);

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>Operations Progress</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Dialog>
//           <DialogTrigger asChild>
//             <div className="grid cursor-pointer grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//               {operations.map((operation) => (
//                 <OperationCard
//                   key={operation.id}
//                   operation={operation}
//                   onClick={() => setSelectedOperation(operation)}
//                 />
//               ))}
//             </div>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[425px]">
//             <DialogHeader>
//               <DialogTitle>Total Operation Details</DialogTitle>
//             </DialogHeader>
//             <ScrollArea className="h-[400px] pr-4">
//               {selectedOperation && <DetailedInfo op={selectedOperation} />}
//             </ScrollArea>
//           </DialogContent>
//         </Dialog>
//       </CardContent>
//     </Card>
//   );
// };

// const OperationCard = ({ operation, onClick }) => (
//   <Card onClick={onClick}>
//     <CardHeader className="pb-2">
//       <CardTitle className="text-sm font-medium">{operation.name}</CardTitle>
//     </CardHeader>
//     <CardContent>
//       <div className="space-y-2">
//         <Progress value={operation.progress} />
//         <p className="text-xs text-muted-foreground">
//           Completed: {operation.completedCount} / {operation.target}
//         </p>
//       </div>
//     </CardContent>
//   </Card>
// );

// const DetailedInfo = ({ op }) => (
//   <div className="space-y-4">
//     <div>
//       <h3 className="font-semibold">Total operations made today</h3>
//       <p className="text-3xl font-bold">{op.completedCount}</p>
//     </div>
//     <p className="text-sm text-muted-foreground">
//       Previous operations processing
//     </p>
//     <div className="space-y-2">
//       <DetailItem title="Target" value={op.target} trend="negative" />
//       <DetailItem title="Last Week" value={0} trend="positive" />
//       <DetailItem title="Last Month" value={0} trend="positive" />
//     </div>
//   </div>
// );

// const DetailItem = ({ title, value, trend }) => (
//   <div className="flex items-center justify-between">
//     <span className="text-sm font-medium">{title}</span>
//     <div
//       className={`flex items-center ${trend === "positive" ? "text-green-600" : "text-red-600"}`}
//     >
//       {trend === "positive" ? (
//         <ChevronUp size={16} />
//       ) : (
//         <ChevronDown size={16} />
//       )}
//       <span className="ml-1 text-sm font-semibold">{value}</span>
//     </div>
//   </div>
// );

// export default Featured;
