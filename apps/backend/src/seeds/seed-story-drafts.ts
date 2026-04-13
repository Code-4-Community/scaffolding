import { StoryDraft } from 'src/story-draft/story-draft.entity';
import { DataSource } from 'typeorm';
import { StoryDraftsSeed } from './story-drafts.seed';

export async function seedStoryDrafts(dataSource: DataSource) {
  const draftRepo = dataSource.getRepository(StoryDraft);

  console.log('Seeding story drafts...');

  for (const { storyTitle, ...data } of StoryDraftsSeed) {
    const exists = await draftRepo.findOne({
      where: { docLink: data.docLink },
    });

    if (!exists) {
      const entity = draftRepo.create(data);
      await draftRepo.save(entity);
      console.log(`  ✓ Created story draft for: "${storyTitle}"`);
    } else {
      console.log(`  - Story draft already exists for: "${storyTitle}"`);
    }
  }
}
