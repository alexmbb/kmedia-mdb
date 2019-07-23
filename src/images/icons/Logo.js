import React from "react";

const SvgLogo = props => (
    <svg viewBox="0 0 40 40" width="1em" height="1em" {...props}>
        <path
            d="M40 27.095V12.906C40 5.807 34.192 0 27.095 0H12.906C5.806 0 0 5.807 0 12.906v14.189C0 34.193 5.806 40 12.906 40h14.189C34.192 40 40 34.193 40 27.095zM11.86 9.775c.487.062.803.574.724 1.11a.663.663 0 0 0-.483-.28c-.253-.038-.465.148-.72.14-.43-.017-.83-.424-.763-.635.09-.276.69-.406 1.242-.335zm.207 2.414c.346-.05.513.25.862.247.176-.001.28-.017.447-.07-.048.424-.313.723-.723.811-.313.067-.47.016-.76-.124-.218-.106-.37-.275-.55-.44a.996.996 0 0 1 .724-.424zm1.318-6.482c-.244.302-.362.493-.687.493-.312 0-.896-.176-.864-.352.068-.343.45-.37.793-.388.311-.016.866.114.758.247zm2.99-.145a.868.868 0 0 1-.688.177c-.358-.044-.56-.225-.758-.529-.234-.357-.275-.686-.138-1.094.408-.061.724.046.94.408.124.207.102.479.228.682.128.206.19.278.416.356zm1.295-2.285c-.17.491-.269.438-.55.491a.732.732 0 0 1-.07-.669.708.708 0 0 1 .52-.493c.15.212.19.42.1.67zm.74 3.73c.165-.123.332-.196.516-.104.055.026-.023.272-.103.421a.794.794 0 0 1-.62.46.63.63 0 0 1 .208-.777zm2.62-2.079c-.063.418-.657.103-1.02-.07-.45-.214-.694-.516-.823-1.023.392-.202.726-.202 1.118 0 .441.227.771.777.725 1.093zm1.654 2.432c-.108.449-.3.715-.689.952-.32.195-.68.388-.936.115-.261-.28.13-.754.544-.986.323-.18.724-.156 1.08-.08zm-.033-.423c-.272.006-.211-.448-.106-.706a.614.614 0 0 1 .45-.386.763.763 0 0 1 0 .74c-.086.173-.154.349-.344.352zm.93-3.948a.83.83 0 0 1-.309.705c-.28.245-.764.476-.932.141-.152-.301.166-.56.447-.74a.86.86 0 0 1 .795-.106zm.068 1.869a.642.642 0 0 1-.55.458c-.207.03-.312-.168-.517-.14a.613.613 0 0 0-.38.175.804.804 0 0 1 .724-.811.737.737 0 0 1 .723.318zm2.656-.247c-.071.507-.308.835-.76 1.058-.385.19-1.072.472-1.1.035-.012-.166.298-.65.653-.882.402-.263.743-.322 1.207-.211zm.31 2.75c-.107.395-.395.675-.785.623-.28-.038-.413-.228-.696-.2a.767.767 0 0 0-.519.246c.006-.477.231-.825.656-1.023.493-.225.973.015 1.343.353zm-.897 1.726a.884.884 0 0 1 .208.74c-.042.327-.132.764-.447.705-.28-.05-.317-.38-.312-.669.007-.374.205-.654.551-.776zm2.759 1.2c-.02.384-.205.658-.55.81-.287.124-.67.253-.793-.036-.122-.278.198-.466.446-.635.295-.199.557-.24.897-.14zm10.42 16.627c0 6.706-5.487 12.194-12.193 12.194H13.297c-6.706 0-12.193-5.488-12.193-12.194V20H18.13l.073-2.699c.031-.886-.132-1.896-.275-2.186-.147-.299-.933-.78-1.586-.953-.931-.245-1.68-.252-2.76-.351-.562-.051-.93.106-1.447-.106.311-.14.936-.088 1.57-.16.62-.07 1.081-.179 1.224-.544.067-.177-.888-.708-1.518-1.058-.53-.295-1.344-.458-1.413-.636.481 0 .659.152 1.06.277l1.076.377a5.07 5.07 0 0 1-.516-.705c-.204-.328-.552-.583-.552-.9L14.1 11.45c.377.5.715.738 1.31.918.299.088.533.129.845.14.683.024 1.523-.134 1.724-.318.136-.125-2.07-1.676-2.633-2.143-.82-.681-2.603-.857-2.306-.925.507-.106 1.992.454 1.887.226-.164-.356-.105-1.065 0-.821.088.908.646 1.293 1.153 1.573 1.408.834 2.172.874 2.086.327-.16-1.02-.425-1.664-1.17-2.361-.895-.836-1.861-.81-2.965-.952-.557-.07-1.43-.315-1.567-.457.321.023.593.018.873.053.161.02 2.149.224 1.506-.244-.511-.372-.692-.656-.954-1.134-.259-.47-.41-.966-.272-1.215.346.777 1.035 1.798 1.86 2.293.575.341 1.209.335 1.484.123.216-.166-.026-1.243-.2-1.878-.144-.52-.423-.909-.618-1.382.344.212.572.55.721.852.124.253.328.71.431.992.173-.07.2-.335.26-.475.11-.265.075-.639.214-.604.068 1.233.105 1.164.021 2.056-.059.58-.112.91-.242 1.478.235.427.382.66.654 1.059.314.457.673 1.11.827 1.057l.206-1.163c.058-.575.094-.836.034-1.41-.07-.716-.257-1.095-.411-1.798-.156-.7-.38-1.622-.38-1.798.138.106.517 1.232.829 2.01.15.377.317.55.55.881.087.141.185.21.344.247.272.058.38-.107.623-.352.218-.332.32-.54.446-.919.151-.447.148-.727.208-1.197.082-.656.105-1.03.102-1.692.208.141.21.984.243 1.62.031.62.102 1.06-.07 1.588-.137.39-.906 1.322-1.171 1.832-.266.511-.036 1.067.103 1.587.139.52.312 1.303.555 1.693.18-.094.482-.856.827-1.376.244-.365.426-.469.65-.846.387-.64.493-1.063.76-1.762.27-.704.449-1.763.621-1.834a7.358 7.358 0 0 1-.138 1.199c-.096.504-.344 1.123-.344 1.269 0 .145.364-.056.45-.129.54-.454.929-.999 1.067-.857-1.104 1.162-1.69 1.938-2.277 2.713-.28.37-.485.8-.481.988.004.187.537.014.791-.177.518-.388 1.277-1.233 1.31-.95l-2.067 2.183c-.104.212-.224.754-.285 1.075-.069.366-.055.321-.069.695.241.07 1.526-.64 2.629-1.276.595-.343 1.174-.96 1.654-1.41.516-.48.763-.77 1.207-1.304.218.082-.466 1.079-.918 1.497-.42.386-.944 1.005-.702 1.252.28.285.61.248 1 .177.759-.14.78-.076 1.674-.04.175.07.72-.13.775.003.066.173-.105.143-.415.213-1.24.141-1.975.045-3.205.422-1.036.317-1.534.307-2.244.953-.435.398-.827.881-.895 1.232.516.072 1.294-.184 2.103-.387 1.103-.275 1.637-.768 2.759-.952.4-.065.629-.087 1.033-.105-.434.226-.675.359-1.102.598-.312.175-.488.277-.795.46.488.112.751.233 1.242.316.415.07.863.07.827.248-1.034-.036-2.102-.106-2.619-.07-.25.015-1.067.25-1.69.563-.792.317-2.206.974-2.206 1.163 0 .528-.02.634.047 1.585l.1 1.855h16.582v6.914zM26.75 16.135c-.24-.302-.408-.68-.17-.985.117-.148.796.038 1.035.458.169.3.262.598.372.924-.475.094-.901.026-1.237-.397zm-2.859-4.58c-.36.191-.746.406-.952.047-.21-.368.22-.682.593-.88.359-.19.815-.186 1.047-.013-.122.41-.317.647-.688.846zM13.481 7.587c.82-.21 1.168-.037 1.168-.037-.436.203-.286.638-1.145.827-.295.064-.856.053-.856.053 0-.172.267-.698.833-.843zm2.338.554c.243 0 .847.132.943.735.098.602-.244.96-.244.96s-.582-.647-.68-.858c-.096-.211-.019-.837-.019-.837zm.144 3.096c.212.173.451.377.285.6-.175.231-.523.082-.77-.071-.287-.181-.427-.397-.482-.74.357-.148.73.021.967.211zm-2.85 3.22c.412-.133 1.06-.333 1.104.106.031.321-.248.47-.519.634-.463.281-.96.244-1.378-.105.204-.345.418-.515.793-.635zm16.262 13.91c.066-.173-.105-.143-.415-.213-1.24-.14-1.975-.045-3.205-.423-1.036-.315-1.534-.306-2.244-.953-.435-.397-.827-.88-.895-1.231.516-.072 1.294.184 2.103.387 1.103.275 1.637.768 2.759.951.4.066.629.088 1.033.105a35.81 35.81 0 0 1-1.896-1.056c.487-.113.75-.235 1.24-.318.416-.07.864-.07.828-.247-1.034.036-2.102.106-2.619.071-.25-.016-1.066-.252-1.69-.564-.792-.318-2.206-.974-2.206-1.163 0-.528-.02-.634.047-1.586l.108-1.994h-4.197l.077 2.839c.032.886-.132 1.895-.275 2.186-.147.3-.933.78-1.586.953-.931.245-1.68.252-2.76.351-.562.051-.93-.106-1.447.106.311.14.936.087 1.57.159.62.07 1.081.18 1.224.545.067.176-.888.708-1.517 1.057-.53.296-1.345.46-1.414.637.481 0 .659-.152 1.06-.277l1.076-.376a5.03 5.03 0 0 0-.516.705c-.204.327-.552.582-.552.898l1.035-1.093c.377-.5.715-.737 1.31-.917a3.13 3.13 0 0 1 .845-.14c.683-.023 1.523.134 1.725.317.135.126-2.071 1.677-2.633 2.144-.821.68-2.604.856-2.307.926.507.105 1.992-.455 1.887-.227-.164.357-.105 1.066 0 .82.088-.907.646-1.292 1.153-1.571 1.408-.834 2.172-.875 2.086-.328-.16 1.019-.425 1.664-1.17 2.36-.895.837-1.861.811-2.965.952-.557.071-1.43.316-1.567.458.321-.024.593-.018.873-.052.161-.02 2.149-.225 1.506.243-.511.371-.692.656-.954 1.134-.258.469-.41.965-.272 1.216.346-.778 1.035-1.8 1.86-2.294.575-.342 1.209-.335 1.484-.123.216.165-.026 1.243-.2 1.878-.144.519-.423.91-.618 1.381.344-.21.572-.55.721-.85.124-.254.33-.71.431-.993.173.07.2.335.26.475.11.265.075.639.214.604.068-1.234.106-1.164.021-2.056-.059-.58-.112-.91-.241-1.478.235-.426.38-.66.653-1.059.315-.458.673-1.11.828-1.057l.205 1.163c.058.575.094.835.034 1.41-.07.716-.257 1.095-.411 1.798-.156.7-.38 1.622-.38 1.798.138-.106.517-1.233.829-2.01.15-.377.317-.55.55-.88a.49.49 0 0 1 .344-.248c.272-.058.38.107.623.352.218.333.32.54.446.918.151.448.149.728.208 1.198.082.656.105 1.03.102 1.693.208-.142.21-.985.243-1.62.031-.622.102-1.06-.07-1.59-.137-.388-.906-1.32-1.171-1.832-.266-.51-.036-1.066.103-1.586.139-.52.312-1.303.555-1.692.18.093.482.856.827 1.375.244.365.426.468.65.846.387.64.493 1.064.76 1.762.271.704.449 1.763.621 1.834a7.35 7.35 0 0 0-.138-1.198c-.095-.505-.344-1.124-.344-1.27 0-.145.364.056.45.128.541.454.929 1 1.067.858-1.104-1.162-1.69-1.938-2.277-2.713-.28-.37-.485-.8-.481-.988.004-.187.537-.014.791.177.52.388 1.277 1.234 1.31.951l-2.067-2.185c-.104-.212-.224-.753-.284-1.074-.07-.367-.056-.321-.07-.695.241-.071 1.526.64 2.629 1.277.595.342 1.175.96 1.654 1.41.516.48.763.768 1.207 1.303.218-.082-.466-1.079-.917-1.497-.42-.386-.944-1.005-.703-1.252.28-.286.61-.248 1-.178.759.142.78.077 1.674.042.175-.07.72.128.775-.004z"
            fill="#FFF"
            fillRule="evenodd"
        />
    </svg>
);

export default SvgLogo;