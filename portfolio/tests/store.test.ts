import { setActivePinia, createPinia } from 'pinia';
import { useStore } from '../stores/store';

describe('useStore', () => {
  let store: ReturnType<typeof useStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useStore();
  });

  it('initializes with correct state', () => {
    expect(store.pisitionsList).toHaveLength(7);
    expect(store.statusList).toHaveLength(3);
    expect(store.listSortEmployee).toHaveLength(6);
    expect(store.listSortClients).toHaveLength(5);
    expect(store.listSortProjects).toHaveLength(3);
    expect(store.tips).toEqual([]);
    expect(store.tipCount).toBe(0);
  });

  it('adds a tip correctly', () => {
    store.addTip('New tip');
    expect(store.tips).toHaveLength(1);
    expect(store.tips[0].text).toBe('New tip');
    expect(store.tipCount).toBe(1);
  });

  it('removes a tip correctly', () => {
    store.addTip('Tip 1');
    store.addTip('Tip 2');
    store.removeTip(0);
    expect(store.tips).toHaveLength(1);
    expect(store.tips[0].text).toBe('Tip 2');
  });

  it('removes the first tip if index is less than 0', () => {
    store.addTip('Tip 1');
    store.addTip('Tip 2');
    store.removeTip(-1);
    expect(store.tips).toHaveLength(1);
    expect(store.tips[0].text).toBe('Tip 2');
  });
});
