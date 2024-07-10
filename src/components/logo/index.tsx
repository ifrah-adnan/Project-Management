import React from "react";

interface LogoProps {
  className?: string;
}

function Logo({ className }: LogoProps) {
  return (
    <svg
      className={className}
      width="90"
      height="26"
      viewBox="0 0 90 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_2001_3302"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="90"
        height="27"
      >
        <path
          d="M89.7001 0.163086H0.100098V26.0037H89.7001V0.163086Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_2001_3302)">
        <path
          d="M74.5759 1.74005V0.413966C74.5759 0.342286 74.6117 0.306446 74.6476 0.270606C74.6834 0.234766 74.7551 0.198926 74.7909 0.198926H74.8626C75.0418 0.198926 75.1493 0.270606 75.1493 0.485646V1.77589C75.1493 1.81173 75.1852 1.84757 75.221 1.84757H77.2281C77.2281 1.84757 77.2639 1.84757 77.2639 1.81173L77.2997 1.77589V0.413966C77.2997 0.342286 77.3356 0.306446 77.3714 0.270606C77.4073 0.234766 77.4789 0.198926 77.5148 0.198926H77.5865C77.7657 0.198926 77.8732 0.270606 77.8732 0.449806V1.70421C77.8732 1.77589 77.909 1.77589 77.9449 1.77589H79.9519C80.0236 1.77589 80.0594 1.74005 80.0594 1.66837V0.413966C80.0594 0.342286 80.0953 0.306446 80.1311 0.234766C80.167 0.198926 80.2386 0.163086 80.3103 0.163086H80.382C80.5612 0.163086 80.6687 0.234766 80.6687 0.449806V1.74005C80.6687 1.74005 80.6687 1.77589 80.7045 1.77589L80.7404 1.81173H82.7833C82.7833 1.81173 82.8191 1.81173 82.8191 1.77589V1.74005V0.449806C82.8191 0.270606 82.9266 0.163086 83.1058 0.163086H83.1775C83.2492 0.163086 83.285 0.198926 83.3209 0.234766C83.3567 0.270606 83.3925 0.342286 83.3925 0.378126V1.70421V1.74005C83.3925 1.74005 83.3925 1.74005 83.3925 1.77589C83.3925 1.77589 83.3925 1.77589 83.4284 1.77589C83.4284 1.77589 83.4284 1.77589 83.4642 1.77589C84.0735 1.77589 84.7545 1.74005 85.3279 1.88341C86.4748 2.20597 87.2274 2.95861 87.5141 4.14133C87.6575 4.64309 87.5858 5.21653 87.6217 5.75413C87.6217 5.78997 87.6575 5.82581 87.6933 5.82581H89.3778C89.4137 5.82581 89.4495 5.82581 89.4853 5.86165C89.5212 5.86165 89.557 5.89749 89.5929 5.93333C89.6287 5.96917 89.6287 6.00501 89.6645 6.04085C89.6645 6.07669 89.7004 6.11253 89.7004 6.14837V6.22005C89.7004 6.29173 89.6646 6.32757 89.6287 6.36341C89.5929 6.39925 89.5212 6.43509 89.4853 6.43509H87.7292C87.6934 6.43509 87.6575 6.47093 87.6575 6.50677V8.51381C87.6575 8.54965 87.6934 8.58549 87.7292 8.58549H89.4853C89.557 8.58549 89.5929 8.62133 89.6287 8.65717C89.6646 8.69301 89.7004 8.76469 89.7004 8.80053V8.87221C89.7004 9.05141 89.6287 9.15893 89.4137 9.15893H87.765C87.6934 9.15893 87.6575 9.19477 87.6575 9.26645V11.3093C87.6575 11.3452 87.6575 11.3452 87.6933 11.3452L87.7292 11.381H89.4853C89.557 11.381 89.5929 11.4168 89.6287 11.4527C89.6646 11.4885 89.7004 11.5602 89.7004 11.596V11.6677C89.7004 11.8469 89.6287 11.9544 89.4137 11.9544H87.7292C87.6934 11.9544 87.6575 11.9903 87.6575 12.0261V14.0332C87.6575 14.069 87.6934 14.1048 87.7292 14.1048H89.4853C89.557 14.1048 89.5929 14.1407 89.6287 14.1765C89.6646 14.2124 89.7004 14.284 89.7004 14.3199V14.3916C89.7004 14.4274 89.7004 14.4632 89.6645 14.4991C89.6645 14.5349 89.6287 14.5708 89.5929 14.6066C89.557 14.6424 89.5212 14.6424 89.4853 14.6783C89.4495 14.6783 89.4137 14.7141 89.3778 14.7141H87.6933C87.6575 14.7141 87.6217 14.75 87.6217 14.7858V16.5778C87.6217 16.6136 87.6217 16.6136 87.6575 16.6136L87.6933 16.6495H89.4495C89.5212 16.6495 89.557 16.6853 89.5929 16.7212C89.6287 16.757 89.6645 16.8287 89.6645 16.8645V16.9362C89.6645 17.1512 89.5929 17.2229 89.3778 17.2229H87.6933C87.6217 17.2229 87.6217 17.2588 87.6217 17.2946V19.2658C87.6217 19.3016 87.6575 19.3375 87.6933 19.3375H89.4137C89.4853 19.3375 89.5212 19.3733 89.5929 19.4092C89.6287 19.445 89.6645 19.5167 89.6645 19.5884V19.66C89.6645 19.8392 89.557 19.9468 89.3778 19.9468H87.7292C87.6217 19.9468 87.5858 19.9826 87.5858 20.0901C87.6575 20.9503 87.6575 21.8821 87.2274 22.6348C86.654 23.71 85.6863 24.2476 84.3602 24.2834C84.0377 24.2834 83.7509 24.3192 83.4284 24.3192C83.3925 24.3192 83.3567 24.3551 83.3567 24.3909V25.8245C83.3567 25.8962 83.3209 25.932 83.285 25.9679C83.2492 26.0037 83.1775 26.0396 83.1417 26.0396H83.07C83.0341 26.0396 82.9983 26.0396 82.9625 26.0037C82.9266 26.0037 82.8908 25.9679 82.8549 25.932C82.8191 25.8962 82.8191 25.8604 82.7833 25.8245C82.7833 25.7887 82.7474 25.7528 82.7474 25.717V24.3192C82.7474 24.3192 82.7474 24.3192 82.7474 24.2834C82.7474 24.2834 82.7474 24.2834 82.7474 24.2476C82.7474 24.2476 82.7474 24.2476 82.7116 24.2476H80.6687H80.6329V24.2834V25.717C80.6329 25.7528 80.6329 25.7887 80.597 25.8245C80.597 25.8604 80.5612 25.8962 80.5253 25.932C80.4895 25.9679 80.4537 25.9679 80.4178 26.0037C80.382 26.0037 80.3462 26.0037 80.3103 26.0037H80.2386C80.167 26.0037 80.1311 25.9679 80.0594 25.932C80.0236 25.8962 79.9877 25.8245 79.9877 25.7528V24.3551C79.9877 24.3192 79.9519 24.2834 79.9161 24.2834H77.8732C77.8015 24.2834 77.8015 24.3192 77.8015 24.3551V25.7528C77.8015 25.9679 77.694 26.0396 77.4789 26.0037H77.4073C77.3356 26.0037 77.2997 25.9679 77.2639 25.932C77.2281 25.8962 77.1922 25.8245 77.1922 25.7887V24.3551C77.1922 24.3192 77.1564 24.2834 77.1205 24.2834H75.1135C75.0777 24.2834 75.0418 24.3192 75.0418 24.3551V25.7528C75.0418 25.7887 75.0418 25.8245 75.006 25.8604C75.006 25.8962 74.9701 25.932 74.9343 25.9679C74.8985 26.0037 74.8626 26.0037 74.8268 26.0396C74.7909 26.0396 74.7551 26.0396 74.7193 26.0396H74.6476C74.5759 26.0396 74.5401 26.0037 74.5042 25.9679C74.4684 25.932 74.4325 25.8604 74.4325 25.8245V24.3909C74.4325 24.3551 74.3967 24.3192 74.3609 24.3192H72.533C72.533 24.3192 72.533 24.3192 72.4972 24.3192C72.4972 24.3192 72.4972 24.3192 72.4972 24.3551V25.7887C72.4972 26.0037 72.3897 26.0754 72.2105 26.0754H72.1388C72.0671 26.0754 72.0313 26.0396 71.9596 26.0037C71.9237 25.9679 71.8879 25.8962 71.8879 25.8245V24.4268C71.8879 24.3909 71.8521 24.3551 71.8162 24.3551H69.9884C69.9525 24.3551 69.9167 24.3909 69.9167 24.4268V25.8245C69.9167 26.0396 69.8092 26.1112 69.5941 26.1112H69.5225C69.4508 26.1112 69.4149 26.0754 69.3791 26.0396C69.3433 26.0037 69.3074 25.932 69.3074 25.8962V24.4626C69.3074 24.4268 69.2716 24.3909 69.2357 24.3909C68.5906 24.3909 67.8738 24.4268 67.2645 24.2476C66.046 23.8533 65.2933 22.9573 65.0783 21.5954C65.0783 21.5237 65.0425 21.5237 64.9708 21.5237H63.1071C63.0354 21.5237 62.9996 21.4879 62.9279 21.452C62.8921 21.4162 62.8562 21.3445 62.8562 21.3087V21.237C62.8204 21.0578 62.8921 20.9503 63.1071 20.9503H64.9708C65.0425 20.9503 65.0783 20.9144 65.0783 20.8428V18.9432C65.0783 18.9074 65.0425 18.8716 65.0066 18.8716H63.1788C62.9996 18.8716 62.8921 18.764 62.8921 18.5848V18.4773C62.8921 18.4415 62.8921 18.4056 62.8921 18.4056C62.8921 18.3698 62.9279 18.3698 62.9279 18.334C62.9637 18.2981 62.9637 18.2981 62.9996 18.2981C63.0354 18.2981 63.0354 18.2981 63.0713 18.2981H65.0425H65.0783V18.2623V16.2552C65.0783 16.1836 65.0425 16.1477 64.9708 16.1477H63.1071C63.0354 16.1477 62.9996 16.1119 62.9637 16.076C62.9279 16.0402 62.8921 15.9685 62.8921 15.9327V15.861C62.8921 15.646 62.9637 15.5743 63.1788 15.5743H65.0066C65.0783 15.5743 65.1141 15.5384 65.1141 15.4668V13.7106C65.1141 13.6389 65.0783 13.6031 65.0066 13.6031H53.7887C53.7529 13.6031 53.7529 13.6031 53.717 13.6389C53.717 13.6389 53.6812 13.6748 53.6812 13.7106C53.3945 15.8252 51.5308 17.3304 49.4162 16.7928C46.9791 16.1836 45.9756 13.4239 47.4092 11.4168C49.0578 9.08725 52.8927 9.69653 53.5737 12.5279C53.6095 12.6712 53.6453 12.8146 53.6812 12.958C53.6812 12.9938 53.717 12.9938 53.717 13.0296C53.7529 13.0296 53.7529 13.0655 53.7887 13.0655H65.0425C65.0425 13.0655 65.0783 13.0655 65.0783 13.0296V12.9938V10.9509V10.9151H65.0425H63.1071C62.8921 10.9151 62.8204 10.8076 62.8562 10.6284V10.5567C62.8562 10.485 62.8921 10.4492 62.9279 10.4133C62.9637 10.3775 63.0354 10.3416 63.0713 10.3416H64.9349C65.0066 10.3416 65.0425 10.3058 65.0425 10.2341V8.19125C65.0425 8.19125 65.0425 8.15541 65.0066 8.15541L64.9708 8.11957H63.0354C62.9637 8.11957 62.9279 8.08373 62.8921 8.04789C62.8562 8.01205 62.8204 7.94037 62.8204 7.90453V7.83285C62.8204 7.61781 62.8921 7.54613 63.1071 7.54613H64.9349C65.0066 7.54613 65.0425 7.51029 65.0425 7.43861V5.46741C65.0425 5.43157 65.0066 5.39573 64.9708 5.39573H63.1071C62.8921 5.39573 62.8204 5.28821 62.8204 5.07317V5.00149C62.8204 4.92981 62.8562 4.89397 62.8921 4.85813C62.9279 4.82229 62.9996 4.78645 63.0354 4.78645H64.8991C64.9708 4.78645 64.9708 4.75061 65.0066 4.71477C65.2575 3.28117 66.0101 2.42101 67.3362 2.02677C67.8738 1.88341 68.5548 1.91925 69.1641 1.91925C69.1999 1.91925 69.2357 1.88341 69.2357 1.84757V0.449806C69.2357 0.234766 69.3433 0.163086 69.5583 0.163086H69.63C69.6658 0.163086 69.7375 0.198926 69.7733 0.234766C69.8092 0.270606 69.845 0.342286 69.845 0.378126L69.8809 1.70421C69.8809 1.74005 69.9167 1.77589 69.9525 1.77589H71.9596C72.0313 1.77589 72.0313 1.74005 72.0313 1.70421V0.449806C72.0313 0.270606 72.1388 0.163086 72.318 0.163086H72.3897C72.4613 0.163086 72.4972 0.198926 72.533 0.234766C72.5689 0.270606 72.6047 0.342286 72.6047 0.378126V1.70421C72.6047 1.70421 72.6047 1.74005 72.6405 1.74005H72.6764H74.5042C74.5401 1.81173 74.5759 1.77589 74.5759 1.74005ZM71.0994 18.7282C72.103 17.2229 73.3573 15.2876 74.3609 13.388C75.3644 11.4527 76.2962 8.65717 75.1852 6.57845C74.6117 5.50325 73.6082 5.00149 72.3897 4.96565C69.5583 4.89397 68.5189 7.33109 68.6265 9.80405C68.6265 9.83989 68.6623 9.87573 68.6981 9.87573H70.9202C70.9561 9.87573 70.9919 9.83989 70.9919 9.80405C70.9919 8.94389 70.9202 7.25941 72.0671 7.11605C73.8949 6.86517 73.3932 10.0549 73.0706 10.9151C72.0671 13.6748 70.2751 16.3628 68.5189 18.6924C68.4473 18.7999 68.4114 18.9074 68.4114 19.0149V21.0578C68.4114 21.0936 68.4473 21.1295 68.4831 21.1295H75.4002C75.4361 21.1295 75.4719 21.0936 75.4719 21.0578V18.9074C75.4719 18.8716 75.4361 18.8357 75.4002 18.8357H71.1353C71.0994 18.8357 71.0636 18.7999 71.0994 18.7282ZM80.382 14.069C80.382 14.0332 80.382 14.0332 80.4178 14.0332L80.4537 13.9973H83.1417C83.1775 13.9973 83.1775 13.9973 83.1775 13.9615L83.2133 13.9256V11.8111C83.2133 11.7752 83.2134 11.7752 83.1775 11.7752L83.1417 11.7394H80.4537C80.4178 11.7394 80.4178 11.7394 80.4178 11.7036L80.382 11.6677V7.65365C80.382 7.61781 80.382 7.61781 80.4178 7.61781L80.4537 7.58197H84.2527C84.2886 7.58197 84.2885 7.58197 84.2885 7.54613C84.2885 7.51029 84.3244 7.51029 84.3244 7.51029V5.35989C84.3244 5.32405 84.3244 5.32405 84.2885 5.32405L84.2527 5.28821H78.0165C77.9807 5.28821 77.9807 5.28821 77.9807 5.32405L77.9449 5.35989V21.0578C77.9449 21.0936 77.9449 21.0936 77.9807 21.0936L78.0165 21.1295H84.2527H84.2885C84.2885 21.1295 84.2885 21.1295 84.3244 21.1295C84.3244 21.1295 84.3244 21.1295 84.3244 21.0936V21.0578V18.8357V18.7999C84.3244 18.7999 84.3244 18.7999 84.3244 18.764C84.3244 18.764 84.3244 18.764 84.2885 18.764H84.2527H80.4537H80.4178C80.4178 18.764 80.4178 18.764 80.382 18.764C80.382 18.764 80.382 18.764 80.382 18.7282V18.6924V14.069Z"
          fill="#FA993A"
        />
        <path d="M3.50524 10.7365V1.70479V1.66895H3.54108H16.0492H16.0851C16.0851 1.66895 16.0851 1.66895 16.1209 1.70479V1.74063V1.77647L13.5404 4.75119C13.5404 4.75119 13.5404 4.75119 13.5046 4.75119H6.58748H6.55164V4.78703V10.7723C6.55164 10.7723 6.55164 10.7723 6.55164 10.8081C6.55164 10.8081 6.55164 10.8081 6.58748 10.8081H13.8272H13.863V10.844V13.8187V13.8545H13.8272H6.58748H6.55164V13.8904V20.9867V21.0225L3.61276 24.8216C3.61276 24.8216 3.61276 24.8216 3.57692 24.8216H3.54108H3.50524V24.7857V13.8545C3.50524 13.8545 3.50524 13.8545 3.50524 13.8187L0.172119 10.8798C0.172119 10.8798 0.172119 10.8798 0.172119 10.844V10.8081C0.172119 10.8081 0.172119 10.8081 0.172119 10.7723C0.172119 10.7723 0.172119 10.7723 0.207959 10.7723H3.4694C3.4694 10.7723 3.4694 10.7723 3.50524 10.7723C3.50524 10.7723 3.50524 10.7723 3.50524 10.7365C3.50524 10.7723 3.50524 10.7723 3.50524 10.7365Z" />
        <path d="M33.6469 11.4891C33.6469 11.3457 33.611 11.3457 33.5752 11.4891L28.02 24.8574C28.02 24.8574 28.02 24.8933 27.9841 24.8933H27.9483H25.6187C25.5828 24.8933 25.5829 24.8933 25.5829 24.8933L25.547 24.8574L20.1352 11.4533C20.0993 11.3457 20.0635 11.3457 20.0635 11.4533V24.7857C20.0635 24.8574 20.0277 24.8933 19.956 24.8933H17.0888C17.0529 24.8933 17.0171 24.8574 17.0171 24.8216V5.14543C17.0171 5.07375 17.0529 5.03791 17.0888 4.96623L19.5976 1.74063C19.5976 1.74063 19.5976 1.74063 19.6334 1.70479H19.6692H19.7051C19.7051 1.70479 19.7051 1.70479 19.7051 1.74063L26.7656 19.4814C26.8014 19.5889 26.8372 19.5889 26.8731 19.4814L33.9694 1.70479C33.9694 1.70479 33.9694 1.66895 34.0053 1.66895H34.0411H36.6216C36.6216 1.66895 36.6216 1.66895 36.6574 1.66895C36.6574 1.66895 36.6574 1.66895 36.6574 1.70479V24.8216V24.8574C36.6574 24.8574 36.6574 24.8574 36.6216 24.8933H36.5857H36.5499L33.6469 22.3845C33.611 22.3486 33.5752 22.3128 33.5752 22.2411V11.4891H33.6469Z" />
        <path d="M42.1055 13.8899C42.1055 13.854 42.0696 13.8182 42.0338 13.7465C41.2095 12.8863 40.3493 12.062 39.525 11.2735C39.4892 11.2377 39.4533 11.166 39.4533 11.0943C40.3493 5.82585 44.6501 1.70425 50.1336 1.66841C54.1836 1.63257 57.7317 3.78297 59.7029 7.33113C59.7029 7.33113 59.7029 7.36697 59.7029 7.40281C59.7029 7.43865 59.7029 7.43865 59.6671 7.43865L57.4092 9.69657C57.4092 9.69657 57.4092 9.69657 57.3733 9.69657H57.3375C57.3375 9.69657 57.3375 9.69657 57.3016 9.69657C57.3016 9.69657 57.3016 9.69657 57.3016 9.66073C54.7212 2.95865 44.901 3.06617 42.6431 10.055C41.102 14.8575 43.4674 20.3411 48.5925 21.5955C52.3199 22.4915 55.5813 20.4844 56.8716 16.9721C56.8716 16.9362 56.9074 16.9362 56.9074 16.9004C56.9432 16.9004 56.9432 16.8646 56.9791 16.8646H60.3839C60.4197 16.8646 60.4556 16.9004 60.4556 16.9363C59.9538 18.5132 59.1295 19.911 58.0184 21.2012C53.5026 26.398 46.012 25.9321 41.7829 20.7353C40.1701 18.7641 39.2741 16.4703 39.0591 13.8899C39.0591 13.8899 39.0591 13.8898 39.0591 13.854C39.0591 13.854 39.0591 13.854 39.0591 13.8182C39.0591 13.8182 39.0591 13.8182 39.0949 13.8182C39.0949 13.8182 39.0949 13.8182 39.1308 13.8182L42.1055 13.8899C42.0696 13.9257 42.0696 13.8899 42.1055 13.8899Z" />
      </g>
    </svg>
  );
}

export default Logo;
