import { Link } from "react-router-dom";

const AddFriend = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="text-lg font-bold text-[#9250ba]"></div>
      <Link
        to="/add-friend"
        className="flex items-center gap-2 p-2 text-[#9250ba] hover:text-[#7a3d9a] transition-colors"
      >
        <div className="text-sm font-medium">Add Friend</div>
      </Link>
    </div>
  );
};

export default AddFriend;