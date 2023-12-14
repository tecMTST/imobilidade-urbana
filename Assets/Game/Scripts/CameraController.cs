using UnityEngine;
using Cinemachine;

public class CameraController : MonoBehaviour
{
    public Camera[] roomCameras;
    public CinemachineVirtualCamera virtualCamera;

    public static CameraController Instance;

    private void Start()
    {
        Instance = this;

        // Disable all cameras except the first room's camera
        for (int i = 1; i < roomCameras.Length; i++)
        {
            roomCameras[i].gameObject.SetActive(false);
        }
    }

    public void SwitchRoom(int roomIndex)
    {
        virtualCamera = roomCameras[roomIndex].GetComponent<CinemachineVirtualCamera>();

        for (int i = 0; i < roomCameras.Length; i++)
        {
            roomCameras[i].gameObject.SetActive(i == roomIndex);

        }
    }
}
