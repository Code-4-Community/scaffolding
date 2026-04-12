import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { Anthology, Author } from '../../types';
import NewStoryDraftModal from './new-story-draft-modal';
import './project-publication-view.css';

interface StoryDraftRow {
  firstName: string;
  lastName: string;
  nameInBook: string;
  classPeriod: string;
  docLink: string;
}

const ProjectPublicationView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [anthology, setAnthology] = useState<Anthology | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storyDrafts, setStoryDrafts] = useState<StoryDraftRow[]>([]);

  const loadStoryDrafts = useCallback(async () => {
    try {
      const [drafts, authors] = await Promise.all([
        apiClient.getStoryDrafts(),
        apiClient.getAuthors(),
      ]);

      const authorMap = new Map<number, Author>();
      for (const author of authors) {
        authorMap.set(author.id, author);
      }

      setStoryDrafts(
        drafts.map((draft) => {
          const author = authorMap.get(draft.authorId);
          const nameParts = author?.name?.split(' ') ?? [];
          return {
            firstName: nameParts[0] ?? '',
            lastName: nameParts.slice(1).join(' '),
            nameInBook: author?.nameInBook ?? '',
            classPeriod: author?.classPeriod ?? '',
            docLink: draft.docLink,
          };
        }),
      );
    } catch {
      // Story drafts will remain as-is on fetch failure
    }
  }, []);

  useEffect(() => {
    if (id) {
      apiClient
        .getAnthology(id)
        .then((data) => {
          setAnthology(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    loadStoryDrafts();
  }, [loadStoryDrafts]);

  if (loading) return <div className="ppv-wrapper">Loading...</div>;
  if (!anthology)
    return <div className="ppv-wrapper">No publication found.</div>;

  return (
    <div className="ppv-wrapper">
      <div className="ppv-breadcrumb">
        <a href="/projects/drafts" className="ppv-breadcrumb-link">
          Projects
        </a>
        <span className="ppv-breadcrumb-sep">›</span>
        <span>{anthology.title}</span>
      </div>

      <div className="ppv-content">
        <h1 className="ppv-title">{anthology.title}</h1>

        <div className="publication-tabs">
          <span className="publication-tab publication-tab--active">
            Document Tracker
          </span>
        </div>

        <div className="ppv-tab-content">
          <div className="document-tracker-header">
            <button
              type="button"
              className="publication-create-btn"
              onClick={() => setIsModalOpen(true)}
            >
              New Story Draft
            </button>
          </div>

          <table className="document-tracker-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Name in Book</th>
                <th>Class Period</th>
                <th>Document Link</th>
              </tr>
            </thead>
            <tbody>
              {storyDrafts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: 'center',
                      color: 'var(--neutral-400)',
                      padding: '24px',
                    }}
                  >
                    No story drafts yet.
                  </td>
                </tr>
              ) : (
                storyDrafts.map((draft, i) => (
                  <tr key={i}>
                    <td>{draft.firstName}</td>
                    <td>{draft.lastName}</td>
                    <td>{draft.nameInBook}</td>
                    <td>{draft.classPeriod}</td>
                    <td>
                      <a href={draft.docLink} target="_blank" rel="noreferrer">
                        Open
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <NewStoryDraftModal
          onClose={() => setIsModalOpen(false)}
          onSaved={loadStoryDrafts}
        />
      )}
    </div>
  );
};

export default ProjectPublicationView;
