import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { POST_BY_ID } from "./api/queries";
import { Post } from "../../../components/Posts";
import { CommentCard } from "../../../components/Comments";
import { useEffect } from "react";
import {
  subscribeToNewLikeComment,
} from "../../../utils/subscriptions";

export const PostById = () => {
  const { id } = useParams<{ id: string }>();

  const { loading, error, data, subscribeToMore } = useQuery(POST_BY_ID, {
    variables: { postId: id },
  });

  useEffect(() => {
    if (subscribeToMore) {
      subscribeToNewLikeComment(subscribeToMore);
    }
  }, [subscribeToMore]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;

  return (
    <div className="flex flex-1 text-white">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center h-full max-h-full">
          <div className="flex flex-col  w-full md:w-7/12 xl:w-5/12 px-3 h-full overflow-y-scroll no-scrollbar">
            <Post {...data.post} />
            <h1 className="text-xl mb-2 font-bold">Comments</h1>
            {data.post.comments.length === 0 && (
              <div className="my-2 text-center bg-slate-800 rounded-lg shadow-xl p-5 border border-slate-700">
                <div className="text-gray-400">No replies yet</div>
              </div>
            )}
            {data.post.comments.map((comment: any, index: number) => {
              const isLast = index === data.post.comments.length - 1;
              return <CommentCard key={index} {...comment} isLastEl={isLast} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
